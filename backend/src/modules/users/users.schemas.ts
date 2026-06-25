import { Type, type Static } from '@sinclair/typebox';

export const UpdateProfileSchema = Type.Object({
  display_name: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String()),
  avatar_url: Type.Optional(Type.String()),
  location_district: Type.Optional(Type.String()),
  location_city: Type.Optional(Type.String()),
  language_pref: Type.Optional(Type.Union([Type.Literal('en'), Type.Literal('rw'), Type.Literal('fr')])),
});

export type UpdateProfileInput = Static<typeof UpdateProfileSchema>;
