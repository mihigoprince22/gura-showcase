import { Type, type Static } from '@sinclair/typebox';

export const PushTokenSchema = Type.Object({
  token: Type.String(),
});

export type PushTokenInput = Static<typeof PushTokenSchema>;

export const NotificationPreferencesSchema = Type.Object({
  outbid_alerts: Type.Boolean(),
  order_updates: Type.Boolean(),
  messages: Type.Boolean(),
  price_drops: Type.Boolean(),
});

export type NotificationPreferencesInput = Static<typeof NotificationPreferencesSchema>;
