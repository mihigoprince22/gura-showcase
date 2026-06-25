import type { FastifyInstance } from 'fastify';
import { OrdersService } from './orders.service.js';
import { CheckoutRequestSchema, type CheckoutRequest, OrderResponseSchema, UpdateOrderStatusSchema, type UpdateOrderStatusInput } from './orders.schemas.js';

export default async function ordersRoutes(fastify: FastifyInstance): Promise<void> {
  const ordersService = new OrdersService();

  fastify.post<{ Body: CheckoutRequest }>(
    '/checkout',
    {
      preValidation: [fastify.authenticate],
      schema: {
        body: CheckoutRequestSchema,
        response: { 200: OrderResponseSchema }
      },
    },
    async (request, reply) => {
      const { listing_id, shipping_address, district } = request.body;
      const buyerId = request.user.sub;

      try {
        const order = await ordersService.initiateCheckout(listing_id, buyerId, shipping_address, district);
        return reply.send(order);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.sub;
      try {
        const order = await ordersService.getOrderDetails(id, userId);
        return reply.send(order);
      } catch (err: any) {
        return reply.status(404).send({ error: err.message });
      }
    }
  );

  fastify.get<{ Querystring: { role?: 'buyer' | 'seller' } }>(
    '/',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { role } = request.query;
      try {
        const orders = await ordersService.getOrders(userId, role);
        return reply.send(orders);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  fastify.put<{ Params: { id: string }, Body: UpdateOrderStatusInput }>(
    '/:id/status',
    {
      preValidation: [fastify.authenticate],
      schema: { body: UpdateOrderStatusSchema }
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;
      const userId = request.user.sub;
      try {
        const order = await ordersService.updateStatus(id, userId, status);
        return reply.send(order);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
