import type { FastifyInstance } from 'fastify';
import { SearchService } from './search.service.js';
import { SearchQuerySchema, SearchResponseSchema, type SearchQuery } from './search.schemas.js';

export default async function searchRoutes(fastify: FastifyInstance): Promise<void> {
  const searchService = new SearchService();

  fastify.get<{ Querystring: SearchQuery }>(
    '/',
    {
      schema: {
        querystring: SearchQuerySchema,
        response: {
          200: SearchResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const results = await searchService.search(request.query);
      return reply.send(results);
    }
  );

  fastify.get(
    '/feed',
    {
      schema: {
        response: {
          200: SearchResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const feed = await searchService.getFeed();
      return reply.send(feed);
    }
  );
}
