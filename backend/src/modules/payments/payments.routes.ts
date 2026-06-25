import type { FastifyInstance } from 'fastify';
import { paymentsService } from './payments.service.js';
import Stripe from 'stripe';
import { config } from '../../config/env.js';

export default async function paymentsRoutes(fastify: FastifyInstance): Promise<void> {
  // Fastify needs to be configured to provide raw body for Stripe webhook
  fastify.post('/webhook', { config: { rawBody: true } }, async (request, reply) => {
    const sig = request.headers['stripe-signature'];
    
    if (!sig || !config.STRIPE_WEBHOOK_SECRET || !config.STRIPE_SECRET_KEY) {
      console.warn('[MOCK WEBHOOK] Received webhook request but Stripe is not configured');
      return reply.status(200).send({ received: true });
    }

    const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
    let event: Stripe.Event;

    try {
      // Note: Fastify might not have request.rawBody natively depending on setup,
      // We assume a plugin like fastify-raw-body is used, or we use request.raw for the incoming message
      const rawBody = (request as any).rawBody || request.body;
      const payloadString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);

      event = stripe.webhooks.constructEvent(
        payloadString, 
        sig, 
        config.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return reply.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await paymentsService.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await paymentsService.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.refunded':
          await paymentsService.handleRefund(event.data.object as Stripe.Charge);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return reply.status(200).send({ received: true });
    } catch (err: any) {
      console.error(`Webhook Processing Error: ${err.message}`);
      return reply.status(500).send({ error: 'Webhook handler failed' });
    }
  });
}
