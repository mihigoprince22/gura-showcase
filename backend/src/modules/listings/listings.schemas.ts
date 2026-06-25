import { Type } from '@sinclair/typebox';

const ConditionSchema = Type.Union([
  Type.Literal('new'),
  Type.Literal('like_new'),
  Type.Literal('good'),
  Type.Literal('fair'),
  Type.Literal('parts_only'),
]);

const ListingFormatSchema = Type.Union([
  Type.Literal('fixed'),
  Type.Literal('auction'),
  Type.Literal('auction_bin'),
]);

const StatusSchema = Type.Union([
  Type.Literal('draft'),
  Type.Literal('active'),
  Type.Literal('sold'),
  Type.Literal('ended'),
  Type.Literal('moderation_hold'),
]);

const ListingResponseSchema = Type.Object({
  id: Type.String(),
  seller_id: Type.String(),
  category_id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  condition: ConditionSchema,
  price: Type.String(), // BIGINT from DB comes as string
  currency: Type.String(),
  listing_format: ListingFormatSchema,
  buy_now_price: Type.Union([Type.String(), Type.Null()]),
  starting_bid: Type.Union([Type.String(), Type.Null()]),
  reserve_price: Type.Union([Type.String(), Type.Null()]),
  current_bid: Type.Union([Type.String(), Type.Null()]),
  bid_count: Type.Number(),
  auction_end: Type.Union([Type.String(), Type.Null()]),
  images: Type.Array(Type.String()),
  shipping_options: Type.Any(),
  location_district: Type.Union([Type.String(), Type.Null()]),
  location_city: Type.Union([Type.String(), Type.Null()]),
  status: StatusSchema,
  view_count: Type.Number(),
  created_at: Type.String(),
  updated_at: Type.String(),
});

export const CreateListingSchema = {
  body: Type.Object({
    category_id: Type.String(),
    title: Type.String({ minLength: 3, maxLength: 200 }),
    description: Type.String({ minLength: 10 }),
    condition: ConditionSchema,
    price: Type.Number({ minimum: 0 }),
    listing_format: Type.Optional(ListingFormatSchema),
    buy_now_price: Type.Optional(Type.Number({ minimum: 0 })),
    starting_bid: Type.Optional(Type.Number({ minimum: 0 })),
    reserve_price: Type.Optional(Type.Number({ minimum: 0 })),
    auction_end: Type.Optional(Type.String({ format: 'date-time' })),
    images: Type.Array(Type.String()), // Can contain base64, so no format constraint
    shipping_options: Type.Optional(Type.Array(Type.Any())),
    location_district: Type.Optional(Type.String()),
    location_city: Type.Optional(Type.String()),
  }),
  response: {
    201: ListingResponseSchema,
  },
};

export const UpdateListingSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  body: Type.Partial(Type.Object({
    title: Type.String({ minLength: 3, maxLength: 200 }),
    description: Type.String({ minLength: 10 }),
    condition: ConditionSchema,
    price: Type.Number({ minimum: 0 }),
    listing_format: ListingFormatSchema,
    buy_now_price: Type.Number({ minimum: 0 }),
    starting_bid: Type.Number({ minimum: 0 }),
    reserve_price: Type.Number({ minimum: 0 }),
    auction_end: Type.String({ format: 'date-time' }),
    images: Type.Array(Type.String()),
    shipping_options: Type.Array(Type.Any()),
    location_district: Type.String(),
    location_city: Type.String(),
    status: StatusSchema,
  })),
  response: {
    200: ListingResponseSchema,
  },
};

export const GetListingSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: ListingResponseSchema,
  },
};

export const ListListingsSchema = {
  querystring: Type.Partial(Type.Object({
    category_id: Type.String(),
    seller_id: Type.String(),
    status: StatusSchema,
    limit: Type.Number({ minimum: 1, maximum: 100 }),
    offset: Type.Number({ minimum: 0 }),
  })),
  response: {
    200: Type.Object({
      items: Type.Array(ListingResponseSchema),
      total: Type.Number(),
    }),
  },
};
