import { Type, type Static } from '@sinclair/typebox';

export const CheckoutRequestSchema = Type.Object({
  listing_id: Type.String({ format: 'uuid' }),
  shipping_address: Type.String(),
  district: Type.String(),
});

export type CheckoutRequest = Static<typeof CheckoutRequestSchema>;

export const OrderResponseSchema = Type.Object({
  id: Type.String(),
  listing_id: Type.String(),
  buyer_id: Type.String(),
  seller_id: Type.String(),
  total_amount: Type.Number(),
  status: Type.String(),
  client_secret: Type.String(), // For frontend Stripe elements
});

export const UpdateOrderStatusSchema = Type.Object({
  status: Type.Enum({
    pending: 'pending',
    paid: 'paid',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
  }),
});

export type UpdateOrderStatusInput = Static<typeof UpdateOrderStatusSchema>;
