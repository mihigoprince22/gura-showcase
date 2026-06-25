import { Client } from 'typesense';
import { config } from '../config/env.js';

export const typesenseClient = new Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2,
});

export const LISTINGS_COLLECTION = 'listings';

export async function initTypesense() {
  try {
    const exists = await typesenseClient.collections(LISTINGS_COLLECTION).retrieve().catch(() => null);
    if (!exists) {
      await typesenseClient.collections().create({
        name: LISTINGS_COLLECTION,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'category_id', type: 'string', facet: true },
          { name: 'condition', type: 'string', facet: true },
          { name: 'price', type: 'int64', facet: true },
          { name: 'listing_format', type: 'string', facet: true },
          { name: 'status', type: 'string', facet: true },
          { name: 'location_district', type: 'string', facet: true },
          { name: 'seller_tier', type: 'string', facet: true },
          { name: 'seller_rating', type: 'float', facet: true },
          { name: 'bid_count', type: 'int32' },
          { name: 'view_count', type: 'int32' },
          { name: 'created_at', type: 'int64' },
          { name: 'is_promoted', type: 'bool' },
          { name: 'images', type: 'string[]' }, // For easy rendering in results
        ],
        default_sorting_field: 'created_at',
      });
      console.log(`Typesense collection '${LISTINGS_COLLECTION}' created.`);
    }
  } catch (err) {
    console.error('Failed to initialize Typesense:', err);
  }
}
