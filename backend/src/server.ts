import Fastify, { type FastifyError } from 'fastify';
import { config } from './config/env.js';
import { healthCheck } from './config/database.js';
import corsPlugin from './plugins/cors.js';
import cookiePlugin from './plugins/cookie.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './modules/auth/auth.routes.js';
import listingsRoutes from './modules/listings/listings.routes.js'; // Added by Week 3-4 agent
import searchRoutes from './modules/search/search.routes.js';
import auctionsRoutes, { auctionsService } from './modules/auctions/auctions.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import messagesRoutes from './modules/messages/messages.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import watchlistRoutes from './modules/watchlist/watchlist.routes.js';
import savedSearchesRoutes from './modules/saved-searches/saved-searches.routes.js';
import { messagesService } from './modules/messages/messages.service.js';
import { initTypesense } from './services/typesense.service.js';
import { Server } from 'socket.io';
import { auctionsWorker } from './modules/auctions/auctions.worker.js';
import { sellerPerformanceWorker } from './modules/users/seller-performance.worker.js';
import { redis } from './plugins/redis.js';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } }
          : undefined,
    },
    trustProxy: true,
  });

  // ── Global Error Handler ───────────────────────────────────
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      fastify.log.error(error, 'Internal server error');
    } else {
      fastify.log.warn(error, `Client error: ${error.message}`);
    }

    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.message,
      });
    }

    return reply.status(statusCode).send({
      statusCode,
      error: error.name || 'Error',
      message: statusCode >= 500 ? 'An unexpected error occurred' : error.message,
    });
  });

  // ── Not Found Handler ─────────────────────────────────────
  fastify.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'The requested resource was not found',
    });
  });

  // ── Register Plugins ──────────────────────────────────────
  await fastify.register(corsPlugin);
  await fastify.register(cookiePlugin);
  await fastify.register(authPlugin);

  // ── Health Check ───────────────────────────────────────────
  fastify.get('/health', async (_request, reply) => {
    const dbHealthy = await healthCheck();
    const status = dbHealthy ? 'healthy' : 'degraded';
    const statusCode = dbHealthy ? 200 : 503;

    return reply.status(statusCode).send({
      status,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
      },
    });
  });

  // ── Register Module Routes ─────────────────────────────────
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(listingsRoutes, { prefix: '/api/listings' }); // Added by Week 3-4 agent
  await fastify.register(searchRoutes, { prefix: '/api/search' });
  await fastify.register(auctionsRoutes, { prefix: '/api/auctions' });
  await fastify.register(ordersRoutes, { prefix: '/api/orders' });
  await fastify.register(messagesRoutes, { prefix: '/api/messages' });
  await fastify.register(reviewsRoutes, { prefix: '/api/reviews' });
  await fastify.register(usersRoutes, { prefix: '/api/users' });
  await fastify.register(paymentsRoutes, { prefix: '/api/payments' });
  await fastify.register(notificationsRoutes, { prefix: '/api/notifications' });
  await fastify.register(watchlistRoutes, { prefix: '/api/watchlist' });
  await fastify.register(savedSearchesRoutes, { prefix: '/api/saved-searches' });

  // Initialize Typesense
  await initTypesense();

  // ── Initialize Socket.io ──────────────────────────────────
  fastify.ready((err) => {
    if (err) throw err;
    const io = new Server(fastify.server, {
      cors: { origin: '*' }
    });
    
    auctionsService.setSocketIo(io);
    auctionsWorker.setSocketIo(io);
    messagesService.setSocketIo(io);
    
    // Start background workers
    auctionsWorker.start();
    sellerPerformanceWorker.start();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join_auction', (listingId) => {
        socket.join(`listing_${listingId}`);
        console.log(`Socket ${socket.id} joined listing_${listingId}`);
      });

      socket.on('join_chat', (threadId) => {
        socket.join(threadId);
        console.log(`Socket ${socket.id} joined chat ${threadId}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  });

  return fastify;
}

async function start() {
  try {
    const fastify = await buildServer();

    await fastify.listen({
      port: config.PORT,
      host: '0.0.0.0',
    });

    fastify.log.info(`GURA Backend running on port ${config.PORT}`);
    fastify.log.info(`Environment: ${config.NODE_ENV}`);

    // Graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        fastify.log.info(`Received ${signal}, shutting down gracefully...`);
        try {
          auctionsWorker.stop();
          sellerPerformanceWorker.stop();
          await redis.close();
          await fastify.close();
          process.exit(0);
        } catch (err) {
          fastify.log.error(err, 'Error during shutdown');
          process.exit(1);
        }
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
