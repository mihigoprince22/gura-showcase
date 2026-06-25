import { ReviewsRepository } from './reviews.repository.js';

export class ReviewsService {
  private repo = new ReviewsRepository();

  async submitReview(orderId: string, reviewerId: string, rating: string, comment?: string) {
    const order = await this.repo.getOrder(orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'complete' && order.status !== 'delivered') throw new Error('Cannot review until order is delivered');
    
    let revieweeId: string;
    let reviewerRole: 'buyer' | 'seller';

    if (order.buyer_id === reviewerId) {
      reviewerRole = 'buyer';
      revieweeId = order.seller_id as string;
    } else if (order.seller_id === reviewerId) {
      reviewerRole = 'seller';
      revieweeId = order.buyer_id as string;
    } else {
      throw new Error('You are not a party to this order');
    }

    const alreadyReviewed = await this.repo.hasReviewed(orderId, reviewerId);
    if (alreadyReviewed) throw new Error('You have already reviewed this order');

    const review = await this.repo.insertReview(orderId, reviewerId, revieweeId, reviewerRole, rating, comment);
    
    // Update aggregate asynchronously or await it
    await this.repo.updateUserRating(revieweeId, reviewerRole === 'buyer' ? 'seller' : 'buyer');

    return review;
  }

  async getReviewsForUser(revieweeId: string) {
    return this.repo.getReviewsForUser(revieweeId);
  }
}

export const reviewsService = new ReviewsService();
