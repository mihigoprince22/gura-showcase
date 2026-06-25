import { Type, type Static } from '@sinclair/typebox';

// ── Request Schemas ──────────────────────────────────────────

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 320 }),
  password: Type.String({ minLength: 8, maxLength: 128 }),
  username: Type.String({ minLength: 3, maxLength: 40, pattern: '^[a-zA-Z0-9_]+$' }),
  displayName: Type.Optional(Type.String({ maxLength: 100 })),
  languagePref: Type.Optional(Type.Union([
    Type.Literal('en'),
    Type.Literal('rw'),
    Type.Literal('fr'),
  ])),
});
export type RegisterBody = Static<typeof RegisterBodySchema>;

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 320 }),
  password: Type.String({ minLength: 1, maxLength: 128 }),
});
export type LoginBody = Static<typeof LoginBodySchema>;

export const RefreshBodySchema = Type.Object({
  refreshToken: Type.String({ minLength: 1 }),
});
export type RefreshBody = Static<typeof RefreshBodySchema>;

export const ForgotPasswordBodySchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 320 }),
});
export type ForgotPasswordBody = Static<typeof ForgotPasswordBodySchema>;

export const ResetPasswordBodySchema = Type.Object({
  token: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 8, maxLength: 128 }),
});
export type ResetPasswordBody = Static<typeof ResetPasswordBodySchema>;

export const VerifyEmailParamsSchema = Type.Object({
  token: Type.String({ minLength: 1 }),
});
export type VerifyEmailParams = Static<typeof VerifyEmailParamsSchema>;

// ── Response Schemas ─────────────────────────────────────────

export const UserPublicSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String(),
  username: Type.String(),
  displayName: Type.Union([Type.String(), Type.Null()]),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  bio: Type.Union([Type.String(), Type.Null()]),
  locationDistrict: Type.Union([Type.String(), Type.Null()]),
  locationCity: Type.Union([Type.String(), Type.Null()]),
  sellerRating: Type.Number(),
  buyerRating: Type.Number(),
  sellerTier: Type.String(),
  verificationStatus: Type.String(),
  isSellerEnabled: Type.Boolean(),
  languagePref: Type.String(),
  createdAt: Type.String(),
  lastActiveAt: Type.String(),
});

export const AuthResponseSchema = Type.Object({
  user: UserPublicSchema,
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export const MessageResponseSchema = Type.Object({
  message: Type.String(),
});

export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
