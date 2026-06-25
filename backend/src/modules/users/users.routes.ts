import type { FastifyInstance } from 'fastify';
import { usersService } from './users.service.js';
import { UpdateProfileSchema, type UpdateProfileInput } from './users.schemas.js';

export default async function usersRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/me',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;
      try {
        const user = await usersService.getMyProfile(userId);
        return reply.send(user);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.put<{ Body: UpdateProfileInput }>(
    '/me',
    {
      preValidation: [fastify.authenticate],
      schema: { body: UpdateProfileSchema },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      try {
        const user = await usersService.updateProfile(userId, request.body);
        return reply.send(user);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.put(
    '/verify',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;
      try {
        const result = await usersService.requestVerification(userId);
        return reply.send(result);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Params: { username: string } }>(
    '/:username',
    async (request, reply) => {
      const { username } = request.params;
      try {
        const user = await usersService.getPublicProfile(username);
        return reply.send(user);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
