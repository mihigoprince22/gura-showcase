import { query, queryOne } from '../../config/database.js';

export class AuctionsRepository {
  async getHighestBid(listingId: string) {
    const sql = `
      SELECT id, bidder_id, bid_amount, maximum_proxy_amount 
      FROM bids 
      WHERE listing_id = $1 AND status = 'winning' 
      ORDER BY bid_amount DESC 
      LIMIT 1
    `;
    return queryOne(sql, [listingId]);
  }

  async insertBid(
    listingId: string, 
    bidderId: string, 
    bidAmount: number, 
    maximumProxyAmount: number, 
    status: 'winning' | 'outbid'
  ) {
    const sql = `
      INSERT INTO bids (listing_id, bidder_id, bid_amount, maximum_proxy_amount, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, listing_id, bidder_id, bid_amount, status, created_at
    `;
    return queryOne(sql, [listingId, bidderId, bidAmount, maximumProxyAmount, status]);
  }

  async updateBidStatus(bidId: string, status: 'winning' | 'outbid') {
    const sql = `UPDATE bids SET status = $1 WHERE id = $2`;
    return query(sql, [status, bidId]);
  }

  async getListingDetails(listingId: string) {
    const sql = `SELECT id, current_price, seller_id, status, end_time FROM listings WHERE id = $1 AND format = 'auction'`;
    return queryOne(sql, [listingId]);
  }

  async updateListingPrice(listingId: string, newPrice: number) {
    const sql = `UPDATE listings SET current_price = $1 WHERE id = $2`;
    return query(sql, [newPrice, listingId]);
  }
}
