import { query, queryOne } from '../../../config/database.js';

export class SellerPerformanceWorker {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(intervalMs = 24 * 60 * 60 * 1000) { // Default runs daily
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[SellerPerformanceWorker] Started');
    
    // Run immediately, then on interval
    this.processPerformances().catch(console.error);
    this.interval = setInterval(() => {
      this.processPerformances().catch(console.error);
    }, intervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.isRunning = false;
    console.log('[SellerPerformanceWorker] Stopped');
  }

  private async processPerformances() {
    console.log('[SellerPerformanceWorker] Running performance recalculation...');
    try {
      // Find all active sellers
      const sqlSellers = `SELECT id FROM users WHERE is_seller_enabled = true`;
      const sellers = await query(sqlSellers);

      for (const seller of sellers.rows) {
        await this.evaluateSeller(seller.id);
      }
      console.log(`[SellerPerformanceWorker] Completed evaluation for ${sellers.rows.length} sellers.`);
    } catch (err) {
      console.error('[SellerPerformanceWorker] Error:', err);
    }
  }

  private async evaluateSeller(sellerId: string) {
    // 1. Fulfillment Rate (Orders shipped / Orders paid) in last 90 days
    const sqlFulfillment = `
      SELECT 
        COUNT(id) as total_orders,
        SUM(CASE WHEN status IN ('shipped', 'delivered', 'complete') THEN 1 ELSE 0 END) as fulfilled_orders
      FROM orders 
      WHERE seller_id = $1 AND created_at > NOW() - INTERVAL '90 days' AND status NOT IN ('pending_payment', 'failed')
    `;
    const fulfillResult = await queryOne(sqlFulfillment, [sellerId]);
    const totalOrders = Number(fulfillResult?.total_orders) || 0;
    const fulfilledOrders = Number(fulfillResult?.fulfilled_orders) || 0;
    const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 100; // default 100% if no orders

    // 2. Average Rating in last 90 days
    const sqlRating = `
      SELECT COALESCE(AVG(CASE WHEN rating = 'positive' THEN 5 WHEN rating = 'neutral' THEN 3 WHEN rating = 'negative' THEN 1 ELSE 0 END), 0) as avg_rating 
      FROM feedback 
      WHERE reviewee_id = $1 AND reviewer_role = 'buyer' AND created_at > NOW() - INTERVAL '90 days'
    `;
    const ratingResult = await queryOne(sqlRating, [sellerId]);
    const avgRating = Number(ratingResult?.avg_rating) || 0;

    // 3. Dispute Rate (Disputed orders / Total orders)
    const sqlDisputes = `
      SELECT COUNT(id) as disputes 
      FROM orders 
      WHERE seller_id = $1 AND status = 'disputed' AND created_at > NOW() - INTERVAL '90 days'
    `;
    const disputeResult = await queryOne(sqlDisputes, [sellerId]);
    const disputes = Number(disputeResult?.disputes) || 0;
    const disputeRate = totalOrders > 0 ? (disputes / totalOrders) * 100 : 0;

    // Determine Tier (Rule-based for MVP)
    // - Super Seller: >= 98% fulfillment, >= 4.8 rating, < 1% disputes, > 10 orders
    // - Verified: >= 90% fulfillment, >= 4.0 rating, < 3% disputes
    // - Unverified: default or worse
    // - Warning/Suspended: < 80% fulfillment, > 10% disputes
    let newTier = 'unverified';

    if (totalOrders > 10 && fulfillmentRate >= 98 && avgRating >= 4.8 && disputeRate < 1) {
      newTier = 'super_seller';
    } else if (fulfillmentRate >= 90 && avgRating >= 4.0 && disputeRate <= 3) {
      newTier = 'gura_certified';
    }

    // We don't demote automatically below 'gura_certified' if they paid for verification,
    // but in a real system we would flag for admin review.
    // For this MVP, we will only upgrade to super_seller or drop to gura_certified.
    if (newTier === 'super_seller') {
      await queryOne(`UPDATE users SET seller_tier = 'super_seller' WHERE id = $1`, [sellerId]);
    } else if (newTier === 'gura_certified' || newTier === 'unverified') {
      // Don't downgrade from gura_certified to unverified automatically for now
      await queryOne(`UPDATE users SET seller_tier = $2 WHERE id = $1 AND seller_tier = 'super_seller'`, [sellerId, newTier]);
    }
  }
}

export const sellerPerformanceWorker = new SellerPerformanceWorker();
