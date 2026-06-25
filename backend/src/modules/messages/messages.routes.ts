import type { FastifyInstance } from 'fastify';
import { messagesService } from './messages.service.js';
import { SendMessageSchema, type SendMessageInput } from './messages.schemas.js';

export default async function messagesRoutes(fastify: FastifyInstance): Promise<void> {
  
  fastify.post<{ Body: SendMessageInput }>(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: { body: SendMessageSchema },
    },
    async (request, reply) => {
      const { listing_id, receiver_id, content } = request.body;
      const senderId = request.user.sub;

      try {
        const msg = await messagesService.sendMessage(listing_id, senderId, receiver_id, content);
        return reply.send(msg);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get(
    '/inbox',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;
      try {
        const inbox = await messagesService.getInbox(userId);
        return reply.send(inbox);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Params: { listingId: string, otherUserId: string } }>(
    '/thread/:listingId/:otherUserId',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { listingId, otherUserId } = request.params;
      const userId = request.user.sub;
      try {
        const thread = await messagesService.getThread(listingId, userId, otherUserId);
        return reply.send(thread);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
