/**
 * Performance & Security Middleware
 * Adiciona cache headers, compression, security enhancements
 */

const compression = require('compression');
const crypto = require('crypto');

/**
 * Cache Control Middleware
 * Configura cache headers por tipo de rota
 */
const cacheControl = (maxAge = 3600) => (req, res, next) => {
  // Static assets - max cache
  if (req.path.match(/\.(css|js|json|png|jpg|gif|ico|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', crypto.createHash('md5').update(req.path).digest('hex'));
  }
  // API responses - no cache (or short cache for GET)
  else if (req.path.startsWith('/api/')) {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    } else {
      res.setHeader('Cache-Control', 'no-store, max-age=0');
    }
  }
  // HTML - no cache
  else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
};

/**
 * Security Headers Middleware
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

/**
 * Compression Middleware
 * Comprime responses > 1KB
 */
const compressionMiddleware = compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

/**
 * Response Time Optimization
 * Set X-Response-Time header
 */
const responseTime = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log slow responses
    if (duration > 1000) {
      const logger = require('../utils/logger');
      logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
};

module.exports = {
  cacheControl,
  securityHeaders,
  compressionMiddleware,
  responseTime
};
