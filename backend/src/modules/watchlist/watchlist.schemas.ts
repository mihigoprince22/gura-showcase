import { Type, type Static } from '@sinclair/typebox';

export const AddWatchlistSchema = Type.Object({
  listing_id: Type.String({ format: 'uuid' }),
});

export type AddWatchlistInput = Static<typeof AddWatchlistSchema>;
