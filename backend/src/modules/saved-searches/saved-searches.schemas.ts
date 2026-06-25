import { Type, type Static } from '@sinclair/typebox';

export const SaveSearchSchema = Type.Object({
  query: Type.String(),
  filters: Type.Optional(Type.Any()),
});

export type SaveSearchInput = Static<typeof SaveSearchSchema>;

export const ToggleAlertSchema = Type.Object({
  enabled: Type.Boolean(),
});

export type ToggleAlertInput = Static<typeof ToggleAlertSchema>;
