import { PaymentsRepository } from './payments.repository.js';
import Stripe from 'stripe';

export class PaymentsService {
  private repo = new PaymentsRepository();

  async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const transaction = await this.repo.getTransactionByPaymentIntent(paymentIntent.id);
    if (!transaction) {
      console.warn(`Transaction not found for PaymentIntent ${paymentIntent.id}`);
      return;
    }

    await this.repo.updateTransactionStatus(paymentIntent.id, 'succeeded');
    await this.repo.updateOrderStatus(transaction.order_id as string, 'paid');
    
    // The order should ideally hold the listing_id. We can fetch the order to get listing_id.
    // For now, we'll assume the paymentIntent metadata has listing_id
    if (paymentIntent.metadata?.listing_id) {
      await this.repo.updateListingStatus(paymentIntent.metadata.listing_id, 'sold');
    }
  }

  async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const transaction = await this.repo.getTransactionByPaymentIntent(paymentIntent.id);
    if (!transaction) return;

    await this.repo.updateTransactionStatus(paymentIntent.id, 'failed');
    await this.repo.updateOrderStatus(transaction.order_id as string, 'cancelled');
  }

  async handleRefund(charge: Stripe.Charge) {
    if (!charge.payment_intent) return;
    const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent.id;
    
    const transaction = await this.repo.getTransactionByPaymentIntent(paymentIntentId);
    if (!transaction) return;

    await this.repo.updateTransactionStatus(paymentIntentId, 'refunded');
    await this.repo.updateOrderStatus(transaction.order_id as string, 'refunded');
  }
}

export const paymentsService = new PaymentsService();
