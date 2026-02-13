/**
 * Redis Cache Strategy & Configuration
 * TTL definitions and cache management
 */

const redis = require('redis');
const logger = require('../utils/logger');

class CacheStrategy {
  constructor() {
    this.client = null;
    this.ttls = {
      // Short cache (5 minutes) - For frequently changing data
      short: 5 * 60,
      
      // Medium cache (30 minutes) - For user data, booking lists
      medium: 30 * 60,
      
      // Long cache (2 hours) - For config, admin data
      long: 2 * 60 * 60,
      
      // Never cache - Sensitive data
      nocache: 0,
    };
  }

  async init() {
    try {
      const redisConfig = {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retryStrategy: (retries) => Math.min(retries * 50, 500),
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
        },
      };
      
      // Apenas add password se não estiver vazia
      if (process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.trim()) {
        redisConfig.password = process.env.REDIS_PASSWORD;
      }
      
      this.client = redis.createClient(redisConfig);

      this.client.on('error', (err) => logger.error('Redis error', err));
      this.client.on('connect', () => logger.info('✅ Redis connected'));

      await this.client.connect();
      return true;
    } catch (err) {
      logger.warn('Redis not available - caching disabled', err.message);
      return false;
    }
  }

  /**
   * Cache booking data (medium TTL - 30 min)
   * Bookings change frequently but don't need ultra-fresh data
   */
  async cacheBooking(bookingId, data) {
    const key = `booking:${bookingId}`;
    await this.set(key, data, this.ttls.medium);
  }

  /**
   * Cache user profile (medium TTL - 30 min)
   * User data changes less frequently
   */
  async cacheUser(userId, data) {
    const key = `user:${userId}`;
    await this.set(key, data, this.ttls.medium);
  }

  /**
   * Cache payment data (NO cache)
   * Payment data MUST always be fresh from DB
   */
  async cachePayment(paymentId, data) {
    // Intentionally DON'T cache payment data
    // Always fetch from DB for consistency
    return null;
  }

  /**
   * Cache service list (long TTL - 2 hours)
   * Services change rarely
   */
  async cacheServices(data) {
    const key = 'services:list';
    await this.set(key, data, this.ttls.long);
  }

  /**
   * Cache admin config (long TTL - 2 hours)
   */
  async cacheConfig(key, data) {
    const fullKey = `config:${key}`;
    await this.set(fullKey, data, this.ttls.long);
  }

  /**
   * Generic set with TTL
   */
  async set(key, value, ttl = this.ttls.medium) {
    try {
      if (!this.client) return;
      
      const serialized = JSON.stringify(value);
      if (ttl > 0) {
        await this.client.setEx(key, ttl, serialized);
      } else {
        // Don't cache if ttl is 0
        return;
      }
    } catch (err) {
      logger.warn('Cache set error', { key, err: err.message });
    }
  }

  /**
   * Generic get
   */
  async get(key) {
    try {
      if (!this.client) return null;
      
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.warn('Cache get error', { key, err: err.message });
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  async invalidate(key) {
    try {
      if (!this.client) return;
      await this.client.del(key);
    } catch (err) {
      logger.warn('Cache invalidate error', { key, err: err.message });
    }
  }

  /**
   * Invalidate all cache for a pattern
   */
  async invalidatePattern(pattern) {
    try {
      if (!this.client) return;
      
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (err) {
      logger.warn('Cache pattern invalidation error', { pattern, err: err.message });
    }
  }

  /**
   * Get cache stats
   */
  async getStats() {
    try {
      if (!this.client) return null;
      
      const info = await this.client.info('stats');
      return info;
    } catch (err) {
      logger.warn('Cache stats error', err.message);
      return null;
    }
  }

  /**
   * Clear all cache
   */
  async flushAll() {
    try {
      if (!this.client) return;
      await this.client.flushAll();
      logger.info('✅ All cache cleared');
    } catch (err) {
      logger.error('Cache flush error', err);
    }
  }
}

module.exports = new CacheStrategy();
