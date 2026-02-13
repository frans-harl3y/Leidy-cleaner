/**
 * Database Connection Pooling Configuration
 * Optimized for production workloads
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

class DatabasePool {
  /**
   * Initialize PostgreSQL connection pool with production-optimized settings
   */
  static createPool() {
    const isDev = process.env.NODE_ENV === 'development';
    const isTest = process.env.NODE_ENV === 'test';

    const poolConfig = {
      // Connection limits
      max: parseInt(process.env.DB_POOL_MAX || (isTest ? '2' : '20')),
      min: parseInt(process.env.DB_POOL_MIN || (isTest ? '1' : '2')),

      // Timeouts (ms)
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000'),
      statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT_MS || '30000'),

      // Connection string
      connectionString: process.env.DATABASE_URL,

      // Advanced options
      application_name: `${process.env.APP_NAME || 'limpeza-pro'}-${process.env.NODE_ENV || 'dev'}`,
      
      // SSL in production
      ...(process.env.NODE_ENV === 'production' && {
        ssl: {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        },
      }),
    };

    const pool = new Pool(poolConfig);

    // Event handlers
    pool.on('connect', () => {
      logger.debug('✅ Database connection established');
    });

    pool.on('error', (err, client) => {
      logger.error('❌ Unexpected error on idle client', err);
      process.exit(-1);
    });

    pool.on('remove', () => {
      logger.debug('Connection removed from pool');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, draining pool...');
      await pool.end();
      process.exit(0);
    });

    return pool;
  }

  /**
   * Execute query with retry logic
   */
  static async executeWithRetry(pool, query, params, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await pool.query(query, params);
        return result;
      } catch (err) {
        lastError = err;
        
        // Retry only on connection errors, not on query errors
        if (!err.message.includes('ECONNREFUSED') && !err.message.includes('ETIMEDOUT')) {
          throw err;
        }
        
        if (i < maxRetries - 1) {
          const delayMs = Math.pow(2, i) * 1000; // Exponential backoff
          logger.warn(`Query retry ${i + 1}/${maxRetries} after ${delayMs}ms`, { query });
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get pool statistics for monitoring
   */
  static getPoolStats(pool) {
    return {
      waitingCount: pool.waitingCount,
      idleCount: pool.idleCount,
      totalCount: pool.totalCount,
      capacity: pool._clients?.length || 0,
    };
  }

  /**
   * Health check
   */
  static async healthCheck(pool) {
    try {
      const result = await pool.query('SELECT NOW() as timestamp');
      return {
        status: 'healthy',
        timestamp: result.rows[0].timestamp,
        poolStats: this.getPoolStats(pool),
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        error: err.message,
        poolStats: this.getPoolStats(pool),
      };
    }
  }
}

module.exports = DatabasePool;
