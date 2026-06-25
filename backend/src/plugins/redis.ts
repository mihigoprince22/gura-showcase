import { Redis } from 'ioredis';
import { config } from '../config/env.js';

class RedisClient {
  private client: Redis | null = null;

  connect() {
    if (!this.client) {
      this.client = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: null,
      });

      this.client.on('error', (err: any) => {
        console.error('Redis connection error:', err);
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis successfully');
      });
    }
  }

  get() {
    if (!this.client) {
      this.connect();
    }
    return this.client!;
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

export const redis = new RedisClient();
