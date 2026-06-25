import { AuctionsRepository } from './auctions.repository.js';
import { redis } from '../../plugins/redis.js';

interface AuctionState {
  current_price: number;
  winner_id: string | null;
  winner_proxy: number;
  end_time: number;
}

export class AuctionsService {
  private repo = new AuctionsRepository();
  private io: any;

  setSocketIo(ioInstance: any) {
    this.io = ioInstance;
  }

  async placeBid(listingId: string, bidderId: string, proxyAmount: number) {
    const redisClient = redis.get();
    const stateKey = `auction:${listingId}:state`;
    const bidsKey = `auction:${listingId}:bids`;

    // Retrieve or initialize state from DB to Redis
    let stateStr = await redisClient.get(stateKey);
    let state: AuctionState;

    if (!stateStr) {
      const listing = await this.repo.getListingDetails(listingId);
      if (!listing) throw new Error('Listing not found or not an auction');
      if (listing.status !== 'active') throw new Error('Auction is not active');
      if (listing.seller_id === bidderId) throw new Error('Cannot bid on your own listing');

      const highestBid = await this.repo.getHighestBid(listingId);
      
      state = {
        current_price: Number(listing.current_price),
        winner_id: highestBid ? highestBid.bidder_id as string : null,
        winner_proxy: highestBid ? Number(highestBid.maximum_proxy_amount) : 0,
        end_time: new Date((listing.end_time as string | number) || 0).getTime(),
      };
      
      // Initialize state in Redis. Set a short expiration (e.g. 24h) to avoid stale data if not cleaned up.
      await redisClient.setnx(stateKey, JSON.stringify(state));
      // Read back to ensure we have the concurrent version if another request initialized it
      stateStr = await redisClient.get(stateKey);
      if (!stateStr) throw new Error('Failed to initialize auction state');
    }

    // We use a simple lock to ensure atomic bid evaluation
    const lockKey = `auction:${listingId}:lock`;
    const lock = await this.acquireLock(redisClient, lockKey, 2000);
    if (!lock) throw new Error('High contention, please try bidding again');

    try {
      // Fetch latest state under lock
      stateStr = (await redisClient.get(stateKey))!;
      state = JSON.parse(stateStr);

      if (Date.now() > state.end_time) {
        throw new Error('Auction has ended');
      }

      const minIncrement = this.calculateIncrement(state.current_price);

      if (proxyAmount < state.current_price + minIncrement && !(!state.winner_id && proxyAmount >= state.current_price)) {
        // Condition logic: If first bid, it can be equal to current_price. Otherwise must be at least current + increment.
        if (state.winner_id || proxyAmount < state.current_price) {
          throw new Error(`Bid must be at least ${state.current_price + minIncrement} RWF`);
        }
      }

      let newCurrentPrice = state.current_price;
      let actualBidToPlace = state.current_price;
      let newWinnerId = state.winner_id;
      let newWinnerProxy = state.winner_proxy;
      let outbidUserId: string | null = null;

      if (!state.winner_id) {
        // First bid
        newWinnerId = bidderId;
        newWinnerProxy = proxyAmount;
        newCurrentPrice = proxyAmount; // Or keep at starting price depending on preference. Let's keep at starting price until competing bid.
        // Usually, 1st bid doesn't jump the price to max proxy.
        newCurrentPrice = state.current_price; 
        actualBidToPlace = state.current_price;
      } else {
        if (proxyAmount > state.winner_proxy) {
          // New bidder wins
          actualBidToPlace = state.winner_proxy + minIncrement;
          if (actualBidToPlace > proxyAmount) actualBidToPlace = proxyAmount;
          
          newCurrentPrice = actualBidToPlace;
          outbidUserId = state.winner_id;
          newWinnerId = bidderId;
          newWinnerProxy = proxyAmount;
        } else if (proxyAmount === state.winner_proxy) {
          // Existing bidder wins ties
          actualBidToPlace = proxyAmount;
          newCurrentPrice = proxyAmount;
          outbidUserId = bidderId;
        } else {
          // Existing bidder proxy defends
          actualBidToPlace = proxyAmount + minIncrement;
          if (actualBidToPlace > state.winner_proxy) actualBidToPlace = state.winner_proxy;
          
          newCurrentPrice = actualBidToPlace;
          outbidUserId = bidderId;
        }
      }

      // Update State
      state.current_price = newCurrentPrice;
      state.winner_id = newWinnerId;
      state.winner_proxy = newWinnerProxy;

      await redisClient.set(stateKey, JSON.stringify(state));

      // Append to Bid Log
      const bidLogEntry = {
        listing_id: listingId,
        bidder_id: bidderId,
        amount: proxyAmount > newCurrentPrice ? proxyAmount : newCurrentPrice, // What they typed
        proxy_amount: proxyAmount,
        actual_amount: actualBidToPlace, // What the system placed
        status: newWinnerId === bidderId ? 'winning' : 'outbid',
        timestamp: Date.now()
      };
      await redisClient.rpush(bidsKey, JSON.stringify(bidLogEntry));

      // Notify clients
      if (this.io) {
        this.io.to(`listing_${listingId}`).emit('bidUpdate', {
          listingId,
          currentPrice: newCurrentPrice,
          winningBidderId: newWinnerId,
        });

        if (outbidUserId && outbidUserId !== bidderId) {
          // Note: In real app, emit to specific user room to show "You have been outbid!"
          this.io.to(outbidUserId).emit('notification', {
            type: 'outbid',
            listingId,
            message: 'You have been outbid!'
          });
        }
      }

      return { success: true, currentPrice: newCurrentPrice, winningBidderId: newWinnerId };
    } finally {
      await this.releaseLock(redisClient, lockKey);
    }
  }

  private calculateIncrement(currentPrice: number): number {
    if (currentPrice < 10000) return 500;
    if (currentPrice < 50000) return 1000;
    if (currentPrice < 200000) return 5000;
    return 10000;
  }

  // Simple Redis Mutex
  private async acquireLock(redisClient: any, key: string, ttl: number): Promise<boolean> {
    const res = await redisClient.set(key, 'LOCKED', 'PX', ttl, 'NX');
    return res === 'OK';
  }

  private async releaseLock(redisClient: any, key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export const auctionsService = new AuctionsService();
