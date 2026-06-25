import { query, queryOne } from '../../config/database.js';

export class SavedSearchesRepository {
  async saveSearch(userId: string, searchQuery: string, filters: any = {}) {
    const sql = `
      INSERT INTO saved_searches (user_id, query, filters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    return queryOne(sql, [userId, searchQuery, JSON.stringify(filters)]);
  }

  async deleteSearch(searchId: string, userId: string) {
    const sql = `DELETE FROM saved_searches WHERE id = $1 AND user_id = $2 RETURNING *`;
    return queryOne(sql, [searchId, userId]);
  }

  async getSavedSearches(userId: string) {
    const sql = `
      SELECT * FROM saved_searches
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const res = await query(sql, [userId]);
    return res.rows;
  }

  async toggleAlert(searchId: string, userId: string, enabled: boolean) {
    const sql = `
      UPDATE saved_searches 
      SET alert_enabled = $1, updated_at = NOW() 
      WHERE id = $2 AND user_id = $3 
      RETURNING *
    `;
    return queryOne(sql, [enabled, searchId, userId]);
  }
}
