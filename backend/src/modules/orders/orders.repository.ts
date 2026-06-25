import { query, queryOne } from '../../config/database.js';

export class OrdersRepository {
  async getListingForCheckout(listingId: string) {
    const sql = `SELECT id, COALESCE(current_bid, price) as current_price, seller_id, status FROM listings WHERE id = $1`;
    return queryOne(sql, [listingId]);
  }

  async createOrder(
    listingId: string,
    buyerId: string,
    sellerId: string,
    amount: number,
    platformFee: number,
    sellerPayout: number,
    shippingAddress: string,
    district: string
  ) {
    const addressJson = JSON.stringify({ address: shippingAddress, district });
    const sql = `
      INSERT INTO orders (listing_id, buyer_id, seller_id, amount, platform_fee, seller_payout, status, shipping_address)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending_payment', $7)
      RETURNING id, listing_id, buyer_id, seller_id, amount, platform_fee, seller_payout, status
    `;
    return queryOne(sql, [listingId, buyerId, sellerId, amount, platformFee, sellerPayout, addressJson]);
  }

  async createTransaction(
    orderId: string,
    amount: number,
    platformFee: number,
    sellerPayout: number,
    stripePaymentIntentId: string
  ) {
    const sql = `
      INSERT INTO transactions (order_id, stripe_payment_intent, amount, platform_fee, seller_payout, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id
    `;
    return queryOne(sql, [orderId, stripePaymentIntentId, amount, platformFee, sellerPayout]);
  }

  async getOrder(orderId: string, userId: string) {
    const sql = `
      SELECT o.*, l.title as listing_title, COALESCE(l.current_bid, l.price) as current_price 
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      WHERE o.id = $1 AND (o.buyer_id = $2 OR o.seller_id = $2)
    `;
    return queryOne(sql, [orderId, userId]);
  }

  async getOrdersForUser(userId: string, role?: 'buyer' | 'seller') {
    let sql = `
      SELECT o.*, l.title as listing_title, l.images, COALESCE(l.current_bid, l.price) as current_price 
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      WHERE o.buyer_id = $1 OR o.seller_id = $1
      ORDER BY o.created_at DESC
    `;
    if (role === 'buyer') {
      sql = `
        SELECT o.*, l.title as listing_title, l.images, COALESCE(l.current_bid, l.price) as current_price 
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        WHERE o.buyer_id = $1
        ORDER BY o.created_at DESC
      `;
    } else if (role === 'seller') {
      sql = `
        SELECT o.*, l.title as listing_title, l.images, COALESCE(l.current_bid, l.price) as current_price 
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        WHERE o.seller_id = $1
        ORDER BY o.created_at DESC
      `;
    }
    const res = await query(sql, [userId]);
    return res.rows;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const sql = `UPDATE orders SET status = $1::order_status_enum, updated_at = NOW() WHERE id = $2 RETURNING *`;
    return queryOne(sql, [status, orderId]);
  }
}
