import { query, queryOne } from '../../config/database.js';

export class WatchlistRepository {
  async addToWatchlist(userId: string, listingId: string, currentPrice: number) {
    const sql = `
      INSERT INTO user_watchlist (user_id, listing_id, last_price_at_add)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, listing_id) DO NOTHING
      RETURNING *
    `;
    return queryOne(sql, [userId, listingId, currentPrice]);
  }

  async removeFromWatchlist(userId: string, listingId: string) {
    const sql = `DELETE FROM user_watchlist WHERE user_id = $1 AND listing_id = $2 RETURNING *`;
    return queryOne(sql, [userId, listingId]);
  }

  async getWatchlist(userId: string) {
    const sql = `
      SELECT 
        w.last_price_at_add, w.created_at,
        l.id, l.title, l.currency, l.status, l.images, COALESCE(l.current_bid, l.price) as current_price
      FROM user_watchlist w
      JOIN listings l ON w.listing_id = l.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `;
    const res = await query(sql, [userId]);
    return res.rows;
  }

  async isWatching(userId: string, listingId: string) {
    const sql = `SELECT 1 FROM user_watchlist WHERE user_id = $1 AND listing_id = $2`;
    const res = await queryOne(sql, [userId, listingId]);
    return !!res;
  }
}
