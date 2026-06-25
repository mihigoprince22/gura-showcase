import { queryOne } from '../../config/database.js';

export class PaymentsRepository {
  async getTransactionByPaymentIntent(paymentIntentId: string) {
    const sql = `SELECT * FROM transactions WHERE stripe_payment_intent = $1`;
    return queryOne(sql, [paymentIntentId]);
  }

  async updateTransactionStatus(paymentIntentId: string, status: string) {
    const sql = `UPDATE transactions SET status = $1 WHERE stripe_payment_intent = $2 RETURNING *`;
    return queryOne(sql, [status, paymentIntentId]);
  }

  async updateOrderStatus(orderId: string, status: string) {
    const sql = `UPDATE orders SET status = $1::order_status_enum, updated_at = NOW() WHERE id = $2 RETURNING *`;
    return queryOne(sql, [status, orderId]);
  }

  async updateListingStatus(listingId: string, status: string) {
    const sql = `UPDATE listings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    return queryOne(sql, [status, listingId]);
  }
}
