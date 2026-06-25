import type { FastifyInstance } from 'fastify';
import { reviewsService } from './reviews.service.js';
import { CreateReviewSchema, type CreateReviewInput } from './reviews.schemas.js';

export default async function reviewsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: CreateReviewInput }>(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: { body: CreateReviewSchema },
    },
    async (request, reply) => {
      const { order_id, rating, comment } = request.body;
      const reviewerId = request.user.sub;

      try {
        const review = await reviewsService.submitReview(order_id, reviewerId, rating, comment);
        return reply.send(review);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Params: { revieweeId: string } }>(
    '/:revieweeId',
    async (request, reply) => {
      const { revieweeId } = request.params;
      try {
        const reviews = await reviewsService.getReviewsForUser(revieweeId);
        return reply.send(reviews);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
