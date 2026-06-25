import type { FastifyInstance } from 'fastify';
import { savedSearchesService } from './saved-searches.service.js';
import { SaveSearchSchema, ToggleAlertSchema, type SaveSearchInput, type ToggleAlertInput } from './saved-searches.schemas.js';

export default async function savedSearchesRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: SaveSearchInput }>(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: { body: SaveSearchSchema },
    },
    async (request, reply) => {
      const { query, filters } = request.body;
      const userId = request.user.sub;
      try {
        const result = await savedSearchesService.saveSearch(userId, query, filters);
        return reply.status(201).send(result);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.sub;
      try {
        await savedSearchesService.deleteSearch(id, userId);
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
        const searches = await savedSearchesService.getSavedSearches(userId);
        return reply.send(searches);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.put<{ Params: { id: string }, Body: ToggleAlertInput }>(
    '/:id/alert',
    {
      preValidation: [fastify.authenticate],
      schema: { body: ToggleAlertSchema },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { enabled } = request.body;
      const userId = request.user.sub;
      try {
        const updated = await savedSearchesService.toggleAlert(id, userId, enabled);
        return reply.send(updated);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
