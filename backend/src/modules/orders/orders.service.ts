import { OrdersRepository } from './orders.repository.js';
import { stripeService } from '../../services/stripe.service.js';

export class OrdersService {
  private repo = new OrdersRepository();

  async initiateCheckout(
    listingId: string,
    buyerId: string,
    shippingAddress: string,
    district: string
  ) {
    const listing = await this.repo.getListingForCheckout(listingId);
    if (!listing) throw new Error('Listing not found');
    if (listing.status !== 'active') throw new Error('Listing is no longer available');
    if (listing.seller_id === buyerId) throw new Error('Cannot buy your own listing');

    const itemPrice = Number(listing.current_price);
    const shippingFee = 2500; // Flat shipping rate for MVP
    const platformFee = Math.floor(itemPrice * 0.05); // 5% Gura fee
    const totalAmount = itemPrice + shippingFee + platformFee;
    const sellerPayout = totalAmount - platformFee; // Or itemPrice + shippingFee

    // Create Order
    const order = await this.repo.createOrder(
      listingId,
      buyerId,
      listing.seller_id as string,
      totalAmount,
      platformFee,
      sellerPayout,
      shippingAddress,
      district
    );

    if (!order) throw new Error('Failed to create order');

    // Create Stripe PaymentIntent
    const paymentIntent = await stripeService.createPaymentIntent(totalAmount, 'rwf', {
      order_id: order.id as string,
      listing_id: listingId,
    });

    // Create Transaction Record
    await this.repo.createTransaction(
      order.id as string,
      totalAmount,
      platformFee,
      sellerPayout,
      paymentIntent.id
    );

    return {
      ...order,
      client_secret: paymentIntent.client_secret,
    };
  }

  async getOrderDetails(orderId: string, userId: string) {
    const order = await this.repo.getOrder(orderId, userId);
    if (!order) throw new Error('Order not found or unauthorized');
    return order;
  }

  async getOrders(userId: string, role?: 'buyer' | 'seller') {
    return this.repo.getOrdersForUser(userId, role);
  }

  async updateStatus(orderId: string, userId: string, newStatus: string) {
    const order = await this.repo.getOrder(orderId, userId);
    if (!order) throw new Error('Order not found or unauthorized');
    
    // In MVP, we just let buyer or seller update status for demo purposes
    // Real app would restrict e.g., only seller can mark 'shipped'
    const updated = await this.repo.updateOrderStatus(orderId, newStatus);
    return updated;
  }
}
