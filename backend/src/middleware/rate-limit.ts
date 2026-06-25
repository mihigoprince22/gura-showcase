import type { FastifyReply, FastifyRequest } from 'fastify';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS).unref();

export interface RateLimitOptions {
  max: number;
  windowMs: number;
  keyPrefix?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { max, windowMs, keyPrefix = 'rl' } = options;

  return async function rateLimitHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const ip = request.ip;
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count++;

    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    reply.header('X-RateLimit-Limit', max);
    reply.header('X-RateLimit-Remaining', remaining);
    reply.header('X-RateLimit-Reset', resetSeconds);

    if (entry.count > max) {
      reply.header('Retry-After', resetSeconds);
      reply.status(429).send({
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
      });
    }
  };
}

// Pre-built rate limiters for common use cases
export const authRateLimiter = createRateLimiter({
  max: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: 'auth',
});

export const apiRateLimiter = createRateLimiter({
  max: 100,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'api',
});
