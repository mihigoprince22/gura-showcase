import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { config } from '../../config/env.js';

export class NotificationsService {
  private expo = new Expo();

  async sendPushNotification(userId: string, title: string, body: string, data: any = {}) {
    // In a real app, we would look up the user's Expo push token from the DB.
    // For MVP, we just log it unless we have a specific test token.
    console.log(`[PUSH NOTIFICATION] To User ${userId}: ${title} - ${body}`, data);
    
    // Example implementation if we had tokens:
    /*
    const pushToken = await db.getUserPushToken(userId);
    if (!Expo.isExpoPushToken(pushToken)) return;
    
    const messages: ExpoPushMessage[] = [{
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    }];
    
    try {
      await this.expo.sendPushNotificationsAsync(messages);
    } catch (error) {
      console.error('Push notification error:', error);
    }
    */
  }

  async notifyOutbid(userId: string, listingId: string, listingTitle: string) {
    return this.sendPushNotification(
      userId,
      'You have been outbid!',
      `Someone placed a higher bid on "${listingTitle}". Tap to bid again.`,
      { screen: 'auction', listingId }
    );
  }

  async notifyAuctionWon(userId: string, listingId: string, listingTitle: string, finalPrice: number) {
    return this.sendPushNotification(
      userId,
      'You won an auction!',
      `Congratulations! You won "${listingTitle}" for ${finalPrice} RWF.`,
      { screen: 'checkout', listingId }
    );
  }

  async notifyOrderShipped(userId: string, orderId: string, trackingNumber?: string) {
    return this.sendPushNotification(
      userId,
      'Your order has shipped',
      trackingNumber ? `Tracking: ${trackingNumber}` : 'Your seller has shipped your order.',
      { screen: 'order_details', orderId }
    );
  }

  async notifyNewMessage(userId: string, senderName: string, listingTitle: string) {
    return this.sendPushNotification(
      userId,
      `New message from ${senderName}`,
      `Regarding: ${listingTitle}`,
      { screen: 'inbox' }
    );
  }

  async notifyPriceDrop(userId: string, listingId: string, listingTitle: string, oldPrice: number, newPrice: number) {
    return this.sendPushNotification(
      userId,
      'Price Drop Alert!',
      `"${listingTitle}" dropped from ${oldPrice} RWF to ${newPrice} RWF.`,
      { screen: 'listing', listingId }
    );
  }
}

export const notificationsService = new NotificationsService();
