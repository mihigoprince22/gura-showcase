import { Type, type Static } from '@sinclair/typebox';

export const CreateReviewSchema = Type.Object({
  order_id: Type.String({ format: 'uuid' }),
  rating: Type.Union([Type.Literal('positive'), Type.Literal('neutral'), Type.Literal('negative')]),
  comment: Type.Optional(Type.String()),
});

export type CreateReviewInput = Static<typeof CreateReviewSchema>;

export const ReviewResponseSchema = Type.Object({
  id: Type.String(),
  order_id: Type.String(),
  reviewer_id: Type.String(),
  reviewee_id: Type.String(),
  reviewer_role: Type.Union([Type.Literal('buyer'), Type.Literal('seller')]),
  rating: Type.Union([Type.Literal('positive'), Type.Literal('neutral'), Type.Literal('negative')]),
  comment: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String(),
});
