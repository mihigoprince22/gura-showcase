import { Type, type Static } from '@sinclair/typebox';

export const StripeWebhookHeadersSchema = Type.Object({
  'stripe-signature': Type.String(),
});
