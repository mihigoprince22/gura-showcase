import { query, queryOne } from '../../config/database.js';
import type { UpdateProfileInput } from './users.schemas.js';

export class UsersRepository {
  async getProfile(userId: string) {
    const sql = `
      SELECT id, email, username, display_name, avatar_url, bio, location_district, location_city,
             seller_rating, buyer_rating, seller_tier, verification_status, is_seller_enabled, language_pref, created_at
      FROM users WHERE id = $1
    `;
    return queryOne(sql, [userId]);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }

    if (fields.length === 0) return this.getProfile(userId);

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    return queryOne(sql, values);
  }

  async getPublicProfile(username: string) {
    const sql = `
      SELECT id, username, display_name, avatar_url, bio, location_district, location_city,
             seller_rating, buyer_rating, seller_tier, verification_status, created_at
      FROM users WHERE username = $1
    `;
    return queryOne(sql, [username]);
  }

  async requestVerification(userId: string) {
    const sql = `UPDATE users SET verification_status = 'email' WHERE id = $1 RETURNING verification_status`;
    return queryOne(sql, [userId]);
  }
}
