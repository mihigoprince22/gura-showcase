import { Type, type Static } from '@sinclair/typebox';

export const SearchQuerySchema = Type.Object({
  q: Type.Optional(Type.String()),
  category_id: Type.Optional(Type.String()),
  condition: Type.Optional(Type.String()),
  listing_format: Type.Optional(Type.String()),
  location_district: Type.Optional(Type.String()),
  seller_tier: Type.Optional(Type.String()),
  price_min: Type.Optional(Type.Number()),
  price_max: Type.Optional(Type.Number()),
  free_shipping: Type.Optional(Type.Boolean()),
  page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
  per_page: Type.Optional(Type.Number({ default: 20, minimum: 1, maximum: 100 })),
});

export type SearchQuery = Static<typeof SearchQuerySchema>;

export const SearchResultItemSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  price: Type.Number(),
  condition: Type.String(),
  listing_format: Type.String(),
  location_district: Type.String(),
  seller_tier: Type.String(),
  images: Type.Array(Type.String()),
});

export const SearchResponseSchema = Type.Object({
  found: Type.Number(),
  page: Type.Number(),
  hits: Type.Array(SearchResultItemSchema),
});
