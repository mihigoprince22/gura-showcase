import { v5 as uuidv5 } from 'uuid';
import { MessagesRepository } from './messages.repository.js';

export class MessagesService {
  private repo = new MessagesRepository();
  private io: any;

  setSocketIo(ioInstance: any) {
    this.io = ioInstance;
  }

  async sendMessage(listingId: string, senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) throw new Error('Cannot message yourself');

    const u1 = senderId < receiverId ? senderId : receiverId;
    const u2 = senderId > receiverId ? senderId : receiverId;
    const threadId = uuidv5(`${listingId}_${u1}_${u2}`, uuidv5.URL);

    const message = await this.repo.insertMessage(threadId, listingId, senderId, receiverId, content);

    if (this.io) {
      const room = `chat_${listingId}_${u1}_${u2}`;
      this.io.to(room).emit('newMessage', message);
    }

    return message;
  }

  async getThread(listingId: string, currentUserId: string, otherUserId: string) {
    await this.repo.markAsRead(listingId, otherUserId, currentUserId);
    const result = await this.repo.getMessagesByThread(listingId, currentUserId, otherUserId);
    return result.rows;
  }

  async getInbox(userId: string) {
    const result = await this.repo.getInboxThreads(userId);
    return result.rows.map((t: any) => {
      const u1 = userId < t.other_user_id ? userId : t.other_user_id;
      const u2 = userId > t.other_user_id ? userId : t.other_user_id;
      return {
        thread_id: `${t.listing_id}_${u1}_${u2}`, // Keep string format for client compatibility
        listing_id: t.listing_id,
        other_user_id: t.other_user_id,
        listing_title: t.listing_title,
        last_message: t.last_message,
        unread_count: Number(t.unread_count),
        updated_at: t.updated_at,
      };
    });
  }
}

export const messagesService = new MessagesService();
