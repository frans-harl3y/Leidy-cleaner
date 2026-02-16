/**
 * CacheService - Unified Cache Engine
 * 
 * Consolidação de:
 * - CacheService.js (231 linhas) - Core cache in-memory com TTL e stats
 * - QueryCacheService.js (417 linhas) - Query-specific cache com fallbacks
 * 
 * Total reduzido de 648 linhas para ~570 linhas (-12% reduction)
 * 
 * Features:
 * 1. In-memory cache com TTL e estatísticas
 * 2. Pattern matching e invalidação inteligente
 * 3. Query-specific caching com fallbacks para diferentes BD schemas
 * 4. Cleanup automático de items expirados
 * 5. Decorators e remember pattern
 */

const logger = require('../utils/logger');

// ============================================================================
// SECTION 1: CACHE CORE
// ============================================================================

class CacheService {
  static store = new Map();
  static stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0
  };

  /**
   * Get cache value
   */
  static get(key) {
    const item = this.store.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      logger.debug(`Cache hit expired: ${key}`);
      return null;
    }

    this.stats.hits++;
    item.accessCount = (item.accessCount || 0) + 1;
    item.lastAccess = Date.now();
    
    return item.value;
  }

  /**
   * Set cache value with TTL
   */
  static set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
      createdAt: Date.now(),
      lastAccess: Date.now(),
      accessCount: 0
    });

    this.stats.sets++;
    logger.debug(`Cache set: ${key} (TTL: ${ttlSeconds}s)`);

    return this;
  }

  /**
   * Delete from cache
   */
  static delete(key) {
    if (this.store.has(key)) {
      this.store.delete(key);
      this.stats.deletes++;
      logger.debug(`Cache delete: ${key}`);
    }
    return this;
  }

  /**
   * Pattern matching invalidation
   * Ex: invalidatePattern('user:*') deletes user:1, user:2, etc
   */
  static invalidatePattern(pattern) {
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    let deleted = 0;

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      logger.debug(`Cache invalidate pattern: ${pattern} (${deleted} items)`);
    }
    return deleted;
  }

  /**
   * Get or compute pattern
   */
  static async remember(key, ttlSeconds, callback) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const value = await callback();
      this.set(key, value, ttlSeconds);
      return value;
    } catch (error) {
      logger.error('Cache remember error', { key, error: error.message });
      throw error;
    }
  }

  /**
   * Function memoization decorator
   */
  static memoize(fn, ttlSeconds = 300, keyGenerator = null) {
    return async function(...args) {
      const key = keyGenerator ? keyGenerator(...args) : `${fn.name}:${JSON.stringify(args)}`;
      
      return CacheService.remember(key, ttlSeconds, () => fn.apply(this, args));
    };
  }

  /**
   * Flush all cache
   */
  static flush() {
    const size = this.store.size;
    this.store.clear();
    logger.info(`Cache flushed: ${size} items removed`);
    return size;
  }

  /**
   * Clean expired items
   */
  static cleanup() {
    const now = Date.now();
    let deleted = 0;

    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.store.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      logger.debug(`Cache cleanup: ${deleted} expired items removed`);
    }
    return deleted;
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      storeSize: this.store.size,
      memoryUsage: this.calculateMemoryUsage()
    };
  }

  /**
   * Calculate memory usage (approximate)
   */
  static calculateMemoryUsage() {
    let bytes = 0;
    for (const [key, item] of this.store.entries()) {
      bytes += key.length * 2; // UTF-16
      bytes += JSON.stringify(item.value).length * 2;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  // =========================================================================
  // SECTION 2: QUERY-SPECIFIC CACHE
  // =========================================================================

  /**
   * TTL by data type (from QueryCacheService)
   */
  static QUERY_TTL = {
    SLOTS: 30 * 60,        // 30 min
    SERVICES: 60 * 60,      // 1 hour
    STAFF: 2 * 60 * 60,     // 2 hours
    USERS: 15 * 60,         // 15 min
    BOOKINGS: 5 * 60,       // 5 min
    REVIEWS: 60 * 60,       // 1 hour
    PRICING: 24 * 60 * 60   // 24 hours
  };

  /**
   * Get available slots with cache (~95% query reduction)
   */
  static async getAvailableSlots(
    db,
    serviceId,
    date,
    duration = 2,
    useCache = true
  ) {
    const cacheKey = `slots:${serviceId}:${date}:${duration}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return cached;
      }
    }

    try {
      const slots = await db.all(`
        SELECT DISTINCT time FROM (
          SELECT DATE_TIME_PARTS(time_slot) as time
          FROM schedule
          WHERE service_id = ? AND date = ? AND available = 1
        )
        WHERE time NOT IN (
          SELECT time FROM bookings
          WHERE service_id = ? AND date = ? AND status != 'cancelled'
        )
        ORDER BY time
      `, serviceId, date, serviceId, date);

      this.set(cacheKey, slots, this.QUERY_TTL.SLOTS);
      logger.debug(`Cache SET: ${cacheKey} (${slots.length} slots)`);

      return slots;
    } catch (error) {
      logger.error('Error fetching available slots', { error: error.message });
      throw error;
    }
  }

  /**
   * Get service with cache (~98% query reduction)
   */
  static async getService(db, serviceId, useCache = true) {
    const cacheKey = `service:${serviceId}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const service = await db.get(
        'SELECT * FROM services WHERE id = ? AND active = 1',
        serviceId
      );

      if (service) {
        this.set(cacheKey, service, this.QUERY_TTL.SERVICES);
      }

      return service;
    } catch (error) {
      logger.error('Error fetching service', { error: error.message });
      throw error;
    }
  }

  /**
   * Get active services with cache (~99% query reduction)
   */
  static async getActiveServices(db, useCache = true) {
    const cacheKey = 'services:active:all';

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const services = await db.all(
        'SELECT * FROM services WHERE active = 1 ORDER BY name'
      );

      this.set(cacheKey, services, this.QUERY_TTL.SERVICES);

      return services;
    } catch (error) {
      logger.error('Error fetching active services', { error: error.message });
      throw error;
    }
  }

  /**
   * Get active staff with cache (~85% query reduction)
   */
  static async getActiveStaff(db, useCache = true) {
    const cacheKey = 'staff:active:all';

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const staff = await db.all(
        `SELECT id, name, email, phone, rating, service_ids
         FROM staff
         WHERE is_active = 1 AND verified = 1
         ORDER BY rating DESC`
      );

      this.set(cacheKey, staff, this.QUERY_TTL.STAFF);

      return staff;
    } catch (error) {
      // Fallback: some DBs store staff as users with role='staff'
      try {
        const fallback = await db.all(
          `SELECT id, name, email, phone, rating, NULL as service_ids
           FROM users
           WHERE role = 'staff' AND is_active = 1 AND verified = 1
           ORDER BY rating DESC`
        );
        this.set(cacheKey, fallback, this.QUERY_TTL.STAFF);
        return fallback;
      } catch (fallbackErr) {
        logger.error('Error fetching active staff', { error: error.message, fallback: fallbackErr.message });
        throw error;
      }
    }
  }

  /**
   * Get user with cache (~70% query reduction)
   */
  static async getUser(db, userId, useCache = true) {
    const cacheKey = `user:${userId}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const user = await db.get(
        `SELECT id, email, name, phone, role, is_active, created_at
         FROM users WHERE id = ?`,
        userId
      );

      if (user) {
        this.set(cacheKey, user, this.QUERY_TTL.USERS);
      }

      return user;
    } catch (error) {
      logger.error('Error fetching user (primary query)', { error: error.message });
      // Fallback: try minimal columns
      try {
        const fallback = await db.get(
          'SELECT id, email, name FROM users WHERE id = ?',
          userId
        );
        if (fallback) {
          this.set(cacheKey, fallback, this.QUERY_TTL.USERS);
        }
        return fallback;
      } catch (fallbackErr) {
        logger.error('Error fetching user (fallback)', { error: fallbackErr.message });
        return null;
      }
    }
  }

  /**
   * Get user bookings with cache (~75% query reduction)
   */
  static async getUserBookings(db, userId, limit = 20, useCache = true) {
    const cacheKey = `user:${userId}:bookings:${limit}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const bookings = await db.all(
        `SELECT * FROM bookings
         WHERE user_id = ? AND status IN ('completed', 'confirmed', 'pending')
         ORDER BY date DESC
         LIMIT ?`,
        userId,
        limit
      );

      this.set(cacheKey, bookings, this.QUERY_TTL.BOOKINGS);

      return bookings;
    } catch (error) {
      logger.error('Error fetching user bookings', { error: error.message });
      throw error;
    }
  }

  /**
   * Get reviews with cache (~90% query reduction)
   */
  static async getServiceReviews(db, serviceId, limit = 10, useCache = true) {
    const cacheKey = `service:${serviceId}:reviews:${limit}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const reviews = await db.all(
        `SELECT r.*, u.name, u.avatar_url
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.service_id = ? AND r.is_approved = 1
         ORDER BY r.created_at DESC
         LIMIT ?`,
        serviceId,
        limit
      );

      this.set(cacheKey, reviews, this.QUERY_TTL.REVIEWS);

      return reviews;
    } catch (error) {
      logger.error('Error fetching reviews', { error: error.message });
      throw error;
    }
  }

  /**
   * Get pricing with cache (~99% query reduction)
   */
  static async getPricing(db, serviceId, useCache = true) {
    const cacheKey = `pricing:${serviceId}`;

    if (useCache) {
      const cached = this.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const pricing = await db.get(
        `SELECT base_price, extra_quarter_price, staff_fee_percent, discount_percent
         FROM pricing WHERE service_id = ?`,
        serviceId
      );

      if (pricing) {
        this.set(cacheKey, pricing, this.QUERY_TTL.PRICING);
      }

      return pricing;
    } catch (error) {
      logger.error('Error fetching pricing', { error: error.message });
      throw error;
    }
  }

  /**
   * Invalidate service-related caches
   */
  static invalidateServiceCache(serviceId) {
    this.delete(`service:${serviceId}`);
    this.delete('services:active:all');
    this.delete(`pricing:${serviceId}`);
    this.invalidatePattern(`service:${serviceId}:*`);
    this.invalidatePattern(`slots:${serviceId}:*`);
    logger.info(`Cache invalidated for service ${serviceId}`);
  }

  /**
   * Invalidate user-related caches
   */
  static invalidateUserCache(userId) {
    this.delete(`user:${userId}`);
    this.invalidatePattern(`user:${userId}:*`);
    logger.info(`Cache invalidated for user ${userId}`);
  }

  /**
   * Invalidate staff cache
   */
  static invalidateStaffCache() {
    this.delete('staff:active:all');
    logger.info('Staff cache invalidated');
  }

  /**
   * Clear all caches
   */
  static invalidateAllCache() {
    logger.info('Clearing all cache...');
    this.store.clear();
    logger.info('✅ All cache cleared');
  }

  /**
   * Get unified cache statistics
   */
  static getCacheStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
      : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      hitRate: `${hitRate}%`,
      itemsInCache: this.store.size,
      memory: `${(JSON.stringify([...this.store]).length / 1024).toFixed(2)}KB`
    };
  }

  // =========================================================================
  // SECTION 3: CACHE KEYS & TTL PRESETS
  // =========================================================================

  /**
   * Common cache keys
   */
  static KEYS = {
    // Users
    USER: (id) => `user:${id}`,
    USER_BOOKINGS: (userId) => `user:${userId}:bookings`,
    USER_REVIEWS: (userId) => `user:${userId}:reviews`,
    
    // Bookings
    BOOKING: (id) => `booking:${id}`,
    BOOKINGS_DATE: (date) => `bookings:date:${date}`,
    
    // Services
    SERVICE: (id) => `service:${id}`,
    SERVICES_LIST: 'services:list',
    
    // Reviews
    REVIEWS_PUBLIC: (page = 1) => `reviews:public:${page}`,
    REVIEWS_BOOKING: (bookingId) => `reviews:booking:${bookingId}`,
    
    // Admin
    ADMIN_DASHBOARD: (period = 'day') => `admin:dashboard:${period}`,
    ADMIN_STATS: (type) => `admin:stats:${type}`,
    
    // Company
    COMPANY_INFO: 'company:info',
    COMPANY_BANKING: 'company:banking'
  };

  /**
   * TTL Presets
   */
  static TTL = {
    SHORT: 60,      // 1 minute
    MEDIUM: 300,    // 5 minutes
    LONG: 1800,     // 30 minutes
    VERY_LONG: 3600 // 1 hour
  };
}

// Automatic cleanup every 10 minutes (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    CacheService.cleanup();
  }, 10 * 60 * 1000);
}

module.exports = CacheService;
