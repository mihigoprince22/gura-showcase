import { Type, type Static } from '@sinclair/typebox';

export const SendMessageSchema = Type.Object({
  listing_id: Type.String({ format: 'uuid' }),
  receiver_id: Type.String({ format: 'uuid' }),
  content: Type.String({ minLength: 1 }),
});

export type SendMessageInput = Static<typeof SendMessageSchema>;

export const MessageResponseSchema = Type.Object({
  id: Type.String(),
  listing_id: Type.String(),
  sender_id: Type.String(),
  receiver_id: Type.String(),
  content: Type.String(),
  is_read: Type.Boolean(),
  created_at: Type.String(),
});

export const ThreadResponseSchema = Type.Object({
  thread_id: Type.String(), // composite format: listingId_buyerId_sellerId
  listing_id: Type.String(),
  other_user_id: Type.String(),
  listing_title: Type.String(),
  last_message: Type.String(),
  unread_count: Type.Number(),
  updated_at: Type.String(),
});
