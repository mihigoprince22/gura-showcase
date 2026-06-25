import type { FastifyPluginAsync } from 'fastify';
import * as listingsService from './listings.service.js';
import {
  CreateListingSchema,
  UpdateListingSchema,
  GetListingSchema,
  ListListingsSchema,
} from './listings.schemas.js';
import type { CreateListingInput, UpdateListingInput } from './listings.types.js';

const listingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: CreateListingInput }>(
    '/',
    {
      schema: CreateListingSchema,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const sellerId = request.user.sub;
      try {
        const listing = await listingsService.createListing(sellerId, request.body);
        return reply.status(201).send(listing);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: err.message || 'Failed to create listing',
        });
      }
    }
  );

  fastify.get<{ Querystring: { category_id?: string; seller_id?: string; status?: string; limit?: number; offset?: number } }>(
    '/',
    { schema: ListListingsSchema },
    async (request, reply) => {
      const filters = request.query;
      try {
        const result = await listingsService.listListings(filters);
        return reply.status(200).send(result);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Failed to fetch listings',
        });
      }
    }
  );

  fastify.get<{ Querystring: { category_id?: string; keywords?: string } }>(
    '/price-intelligence',
    async (request, reply) => {
      const { category_id, keywords } = request.query;
      try {
        const result = await listingsService.getPriceIntelligence(category_id, keywords);
        return reply.status(200).send(result);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Failed to fetch price intelligence',
        });
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: GetListingSchema },
    async (request, reply) => {
      try {
        const listing = await listingsService.getListingById(request.params.id);
        if (!listing) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Listing not found',
          });
        }
        return reply.status(200).send(listing);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Failed to fetch listing',
        });
      }
    }
  );

  fastify.put<{ Params: { id: string }; Body: UpdateListingInput }>(
    '/:id',
    {
      schema: UpdateListingSchema,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const sellerId = request.user.sub;
      try {
        const listing = await listingsService.updateListing(request.params.id, sellerId, request.body);
        if (!listing) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Listing not found or you are not the owner',
          });
        }
        return reply.status(200).send(listing);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: err.message || 'Failed to update listing',
        });
      }
    }
  );
};

export default listingsRoutes;
