import type { FastifyInstance } from 'fastify';
import { AuctionsService } from './auctions.service.js';
import { PlaceBidSchema, type PlaceBidInput } from './auctions.schemas.js';

export const auctionsService = new AuctionsService();

export default async function auctionsRoutes(fastify: FastifyInstance): Promise<void> {
  
  fastify.post<{ Body: PlaceBidInput }>(
    '/bid',
    {
      preValidation: [fastify.authenticate],
      schema: {
        body: PlaceBidSchema,
      },
    },
    async (request, reply) => {
      const { listing_id, bid_amount } = request.body;
      const bidderId = request.user.sub;

      try {
        const result = await auctionsService.placeBid(listing_id, bidderId, bid_amount);
        return reply.send(result);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
