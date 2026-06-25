import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import { config } from '../config/env.js';
import type { FastifyInstance } from 'fastify';

export default fp(async function cookiePlugin(fastify: FastifyInstance) {
  await fastify.register(cookie, {
    secret: config.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  });
});
