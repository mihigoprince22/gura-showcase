import type { FastifyInstance } from 'fastify';
import { PushTokenSchema, NotificationPreferencesSchema, type PushTokenInput, type NotificationPreferencesInput } from './notifications.schemas.js';

export default async function notificationsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: PushTokenInput }>(
    '/push-token',
    {
      preValidation: [fastify.authenticate],
      schema: { body: PushTokenSchema },
    },
    async (request, reply) => {
      const { token } = request.body;
      const userId = request.user.sub;
      
      // MVP: Just log the token instead of saving to DB
      console.log(`[NOTIFICATIONS] Registered push token for user ${userId}: ${token}`);
      
      return reply.send({ success: true });
    }
  );

  fastify.get(
    '/preferences',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      // Mock preferences for MVP
      return reply.send({
        outbid_alerts: true,
        order_updates: true,
        messages: true,
        price_drops: true,
      });
    }
  );

  fastify.put<{ Body: NotificationPreferencesInput }>(
    '/preferences',
    {
      preValidation: [fastify.authenticate],
      schema: { body: NotificationPreferencesSchema },
    },
    async (request, reply) => {
      // MVP: Just mock a success response
      return reply.send(request.body);
    }
  );
}
