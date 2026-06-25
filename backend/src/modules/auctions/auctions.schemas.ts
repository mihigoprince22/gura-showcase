import { Type, type Static } from '@sinclair/typebox';

export const PlaceBidSchema = Type.Object({
  listing_id: Type.String({ format: 'uuid' }),
  bid_amount: Type.Number(),
});

export type PlaceBidInput = Static<typeof PlaceBidSchema>;

export const BidResponseSchema = Type.Object({
  id: Type.String(),
  listing_id: Type.String(),
  bidder_id: Type.String(),
  bid_amount: Type.Number(),
  status: Type.String(), // 'winning', 'outbid'
  created_at: Type.String(),
});
