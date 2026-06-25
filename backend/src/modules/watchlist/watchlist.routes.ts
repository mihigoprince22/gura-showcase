import type { FastifyInstance } from 'fastify';
import { watchlistService } from './watchlist.service.js';
import { AddWatchlistSchema, type AddWatchlistInput } from './watchlist.schemas.js';

export default async function watchlistRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: AddWatchlistInput }>(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: { body: AddWatchlistSchema },
    },
    async (request, reply) => {
      const { listing_id } = request.body;
      const userId = request.user.sub;
      try {
        await watchlistService.addToWatchlist(userId, listing_id);
        return reply.status(201).send({ success: true });
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.delete<{ Params: { listingId: string } }>(
    '/:listingId',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { listingId } = request.params;
      const userId = request.user.sub;
      try {
        await watchlistService.removeFromWatchlist(userId, listingId);
        return reply.send({ success: true });
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get(
    '/',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;
      try {
        const list = await watchlistService.getWatchlist(userId);
        return reply.send(list);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Params: { listingId: string } }>(
    '/:listingId/status',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { listingId } = request.params;
      const userId = request.user.sub;
      try {
        const isWatching = await watchlistService.isWatching(userId, listingId);
        return reply.send({ isWatching });
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
