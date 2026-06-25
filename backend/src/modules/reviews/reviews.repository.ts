import { query, queryOne } from '../../config/database.js';

export class ReviewsRepository {
  async getOrder(orderId: string) {
    const sql = `SELECT id, buyer_id, seller_id, status FROM orders WHERE id = $1`;
    return queryOne(sql, [orderId]);
  }

  async hasReviewed(orderId: string, reviewerId: string) {
    const sql = `SELECT id FROM feedback WHERE order_id = $1 AND reviewer_id = $2`;
    const res = await queryOne(sql, [orderId, reviewerId]);
    return !!res;
  }

  async insertReview(orderId: string, reviewerId: string, revieweeId: string, reviewerRole: string, rating: string, comment?: string) {
    const sql = `
      INSERT INTO feedback (order_id, reviewer_id, reviewee_id, reviewer_role, rating, comment)
      VALUES ($1, $2, $3, $4::reviewer_role_enum, $5::rating_enum, $6)
      RETURNING id, order_id, reviewer_id, reviewee_id, reviewer_role, rating, comment, created_at
    `;
    return queryOne(sql, [orderId, reviewerId, revieweeId, reviewerRole, rating, comment || null]);
  }

  async getReviewsForUser(revieweeId: string) {
    const sql = `
      SELECT f.*, u.display_name as reviewer_name 
      FROM feedback f
      JOIN users u ON f.reviewer_id = u.id
      WHERE f.reviewee_id = $1
      ORDER BY f.created_at DESC
    `;
    const res = await query(sql, [revieweeId]);
    return res.rows;
  }

  async updateUserRating(userId: string, targetRole: 'buyer' | 'seller') {
    // targetRole is the role of the user being reviewed. 
    // If targetRole is 'seller', we calculate their seller_rating.
    const sql = `
      WITH stats AS (
        SELECT 
          COUNT(id) as total_reviews,
          SUM(CASE WHEN rating = 'positive' THEN 5 WHEN rating = 'neutral' THEN 3 WHEN rating = 'negative' THEN 1 ELSE 0 END) as total_score
        FROM feedback
        WHERE reviewee_id = $1 AND reviewer_role = $2::reviewer_role_enum
      )
      UPDATE users 
      SET 
        ${targetRole === 'seller' ? 'seller_rating' : 'buyer_rating'} = 
          CASE WHEN (SELECT total_reviews FROM stats) > 0 
               THEN CAST((SELECT total_score FROM stats) AS DECIMAL) / (SELECT total_reviews FROM stats)
               ELSE 0.00 END
      WHERE id = $1
      RETURNING ${targetRole === 'seller' ? 'seller_rating' : 'buyer_rating'} as rating
    `;
    return queryOne(sql, [userId, targetRole === 'seller' ? 'buyer' : 'seller']); 
    // Wait, the query asks for `reviewer_role` which is the role of the person leaving the review. 
    // If targetRole is seller, then the reviewer_role must have been buyer.
  }
}
