import { redis } from '../../plugins/redis.js';
import { AuctionsRepository } from './auctions.repository.js';
import { query } from '../../config/database.js';

export class AuctionsWorker {
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  private repo = new AuctionsRepository();
  private io: any;

  setSocketIo(ioInstance: any) {
    this.io = ioInstance;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Run every 5 seconds
    this.intervalId = setInterval(() => this.processEndedAuctions(), 5000);
    console.log('Auctions Worker started');
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    console.log('Auctions Worker stopped');
  }

  private async processEndedAuctions() {
    const redisClient = redis.get();
    const now = Date.now();
    
    // Fetch all listings whose end time is in the past
    // The sorted set `auctions:ending` has listingId as member and end_time as score
    const endedAuctions = await redisClient.zrangebyscore('auctions:ending', 0, now);

    for (const listingId of endedAuctions) {
      const lockKey = `auction:${listingId}:lock`;
      const lock = await this.acquireLock(redisClient, lockKey, 10000); // 10s lock
      
      if (!lock) continue; // Skip if currently being processed or bid upon

      try {
        console.log(`Processing ended auction: ${listingId}`);
        
        const stateKey = `auction:${listingId}:state`;
        const bidsKey = `auction:${listingId}:bids`;

        const stateStr = await redisClient.get(stateKey);
        
        if (stateStr) {
          const state = JSON.parse(stateStr);
          
          // 1. Update final price and status in postgres
          await query(`UPDATE listings SET current_price = $1, status = 'ended' WHERE id = $2`, [state.current_price, listingId]);
          
          // 2. Fetch bid history and insert into postgres
          const bidLogs = await redisClient.lrange(bidsKey, 0, -1);
          for (const bidLogStr of bidLogs) {
            const bid = JSON.parse(bidLogStr);
            // In a real app we might batch insert this
            await this.repo.insertBid(listingId, bid.bidder_id, bid.actual_amount, bid.proxy_amount, bid.status);
          }
          
          // Cleanup Redis keys
          await redisClient.del(stateKey, bidsKey);
        } else {
          // No bids placed or state expired. Just update listing status
          await query(`UPDATE listings SET status = 'ended' WHERE id = $1`, [listingId]);
        }

        // Remove from the processing queue
        await redisClient.zrem('auctions:ending', listingId);

        // Notify via WebSocket
        if (this.io) {
          this.io.to(`listing_${listingId}`).emit('auctionEnded', {
            listingId,
            message: 'Auction has ended'
          });
        }
        
      } catch (err) {
        console.error(`Error processing auction ${listingId}:`, err);
      } finally {
        await this.releaseLock(redisClient, lockKey);
      }
    }
  }

  private async acquireLock(redisClient: any, key: string, ttl: number): Promise<boolean> {
    const res = await redisClient.set(key, 'LOCKED', 'PX', ttl, 'NX');
    return res === 'OK';
  }

  private async releaseLock(redisClient: any, key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export const auctionsWorker = new AuctionsWorker();
