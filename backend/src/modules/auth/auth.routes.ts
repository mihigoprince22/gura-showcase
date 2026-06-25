import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';
import {
  RegisterBodySchema,
  LoginBodySchema,
  RefreshBodySchema,
  ForgotPasswordBodySchema,
  ResetPasswordBodySchema,
  VerifyEmailParamsSchema,
  AuthResponseSchema,
  TokenResponseSchema,
  MessageResponseSchema,
  ErrorResponseSchema,
  UserPublicSchema,
  type RegisterBody,
  type LoginBody,
  type RefreshBody,
  type ForgotPasswordBody,
  type ResetPasswordBody,
  type VerifyEmailParams,
} from './auth.schemas.js';
import { AuthService } from './auth.service.js';
import { authRateLimiter } from '../../middleware/rate-limit.js';

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authService = new AuthService(fastify);

  // ── POST /register ───────────────────────────────────────
  fastify.post<{ Body: RegisterBody }>(
    '/register',
    {
      schema: {
        body: RegisterBodySchema,
        response: {
          201: AuthResponseSchema,
          409: ErrorResponseSchema,
        },
      },
      preHandler: [authRateLimiter],
    },
    async (request, reply) => {
      try {
        const result = await authService.register(request.body);
        return reply.status(201).send(result);
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── POST /login ──────────────────────────────────────────
  fastify.post<{ Body: LoginBody }>(
    '/login',
    {
      schema: {
        body: LoginBodySchema,
        response: {
          200: AuthResponseSchema,
          401: ErrorResponseSchema,
        },
      },
      preHandler: [authRateLimiter],
    },
    async (request, reply) => {
      try {
        const result = await authService.login(request.body);
        return reply.status(200).send(result);
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── POST /refresh ────────────────────────────────────────
  fastify.post<{ Body: RefreshBody }>(
    '/refresh',
    {
      schema: {
        body: RefreshBodySchema,
        response: {
          200: TokenResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.refreshToken(request.body.refreshToken);
        return reply.status(200).send(result);
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── POST /logout ─────────────────────────────────────────
  fastify.post<{ Body: RefreshBody }>(
    '/logout',
    {
      schema: {
        body: RefreshBodySchema,
        response: {
          200: MessageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        await authService.logout(request.body.refreshToken);
        return reply.status(200).send({ message: 'Logged out successfully' });
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── POST /forgot-password ────────────────────────────────
  fastify.post<{ Body: ForgotPasswordBody }>(
    '/forgot-password',
    {
      schema: {
        body: ForgotPasswordBodySchema,
        response: {
          200: MessageResponseSchema,
        },
      },
      preHandler: [authRateLimiter],
    },
    async (request, reply) => {
      try {
        await authService.forgotPassword(request.body.email);
        // Always respond with success to prevent email enumeration
        return reply.status(200).send({
          message: 'If an account with that email exists, a password reset link has been sent',
        });
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── POST /reset-password ─────────────────────────────────
  fastify.post<{ Body: ResetPasswordBody }>(
    '/reset-password',
    {
      schema: {
        body: ResetPasswordBodySchema,
        response: {
          200: MessageResponseSchema,
          400: ErrorResponseSchema,
        },
      },
      preHandler: [authRateLimiter],
    },
    async (request, reply) => {
      try {
        await authService.resetPassword(request.body.token, request.body.newPassword);
        return reply.status(200).send({ message: 'Password has been reset successfully' });
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── GET /verify-email/:token ─────────────────────────────
  fastify.get<{ Params: VerifyEmailParams }>(
    '/verify-email/:token',
    {
      schema: {
        params: VerifyEmailParamsSchema,
        response: {
          200: MessageResponseSchema,
          400: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        await authService.verifyEmail(request.params.token);
        return reply.status(200).send({ message: 'Email verified successfully' });
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );

  // ── GET /me (protected) ──────────────────────────────────
  fastify.get(
    '/me',
    {
      schema: {
        response: {
          200: UserPublicSchema,
          401: ErrorResponseSchema,
        },
      },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const user = await authService.getMe(request.user.sub);
        return reply.status(200).send(user);
      } catch (error) {
        return handleServiceError(reply, error);
      }
    }
  );
}

// ── Error Handler ──────────────────────────────────────────

function handleServiceError(reply: FastifyReply, error: unknown): FastifyReply {
  if (error instanceof Error && 'statusCode' in error) {
    const httpError = error as Error & { statusCode: number };
    return reply.status(httpError.statusCode).send({
      statusCode: httpError.statusCode,
      error: getHttpErrorName(httpError.statusCode),
      message: httpError.message,
    });
  }

  // Log unexpected errors
  console.error('Unexpected error in auth route:', error);
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}

function getHttpErrorName(statusCode: number): string {
  const names: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };
  return names[statusCode] || 'Error';
}
