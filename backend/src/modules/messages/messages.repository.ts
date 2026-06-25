import { query, queryOne } from '../../config/database.js';

export class MessagesRepository {
  async insertMessage(threadId: string, listingId: string, senderId: string, receiverId: string, body: string) {
    const sql = `
      INSERT INTO messages (thread_id, listing_id, sender_id, receiver_id, body)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, thread_id, listing_id, sender_id, receiver_id, body as content, read_at, sent_at as created_at
    `;
    return queryOne(sql, [threadId, listingId, senderId, receiverId, body]);
  }

  async getMessagesByThread(listingId: string, userId1: string, userId2: string) {
    const sql = `
      SELECT id, thread_id, listing_id, sender_id, receiver_id, body as content, read_at, sent_at as created_at
      FROM messages
      WHERE listing_id = $1 
        AND ((sender_id = $2 AND receiver_id = $3) OR (sender_id = $3 AND receiver_id = $2))
      ORDER BY sent_at ASC
    `;
    return query(sql, [listingId, userId1, userId2]);
  }

  async markAsRead(listingId: string, senderId: string, receiverId: string) {
    const sql = `
      UPDATE messages 
      SET read_at = now() 
      WHERE listing_id = $1 AND sender_id = $2 AND receiver_id = $3 AND read_at IS NULL
    `;
    return query(sql, [listingId, senderId, receiverId]);
  }

  async getInboxThreads(userId: string) {
    const sql = `
      SELECT DISTINCT ON (m.thread_id)
        m.thread_id,
        m.listing_id,
        CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END as other_user_id,
        l.title as listing_title,
        m.body as last_message,
        m.sent_at as updated_at,
        (SELECT COUNT(*) FROM messages m2 WHERE m2.thread_id = m.thread_id AND m2.receiver_id = $1 AND m2.read_at IS NULL) as unread_count
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY 
        m.thread_id,
        m.sent_at DESC
    `;
    return query(sql, [userId]);
  }
}
