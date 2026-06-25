import { WatchlistRepository } from './watchlist.repository.js';
import { queryOne } from '../../config/database.js';

export class WatchlistService {
  private repo = new WatchlistRepository();

  async addToWatchlist(userId: string, listingId: string) {
    const listingQuery = `SELECT COALESCE(current_bid, price) as current_price FROM listings WHERE id = $1`;
    const listing = await queryOne(listingQuery, [listingId]);
    if (!listing) throw new Error('Listing not found');

    return this.repo.addToWatchlist(userId, listingId, Number(listing.current_price));
  }

  async removeFromWatchlist(userId: string, listingId: string) {
    return this.repo.removeFromWatchlist(userId, listingId);
  }

  async getWatchlist(userId: string) {
    return this.repo.getWatchlist(userId);
  }

  async isWatching(userId: string, listingId: string) {
    return this.repo.isWatching(userId, listingId);
  }
}

export const watchlistService = new WatchlistService();
