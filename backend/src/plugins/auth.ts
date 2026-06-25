import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { config } from '../config/env.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      username: string;
    };
    user: {
      sub: string;
      email: string;
      username: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: '15m',
    },
    verify: {
      maxAge: '15m',
    },
  });

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or expired access token',
        });
      }
    }
  );
});
