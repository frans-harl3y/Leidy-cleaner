/**
 * Global Error Handler Middleware
 * Centraliza tratamento de erros com logging estruturado e validação integrada
 */

const logger = require('../utils/logger');
const Sentry = require('@sentry/node');
const InputValidator = require('../utils/InputValidator');

/**
 * Controller para erro 404
 */
const handle404 = (req, res) => {
  return res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
};

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

/**
 * Middleware para sanitizar input requests
 */
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        sanitized[key] = InputValidator.sanitize({ [key]: value }, { [key]: { type: 'string' } })[key];
      } else {
        sanitized[key] = value;
      }
    }
    req.body = sanitized;
  }
  next();
};

/**
 * Global Error Handler
 * NOTA: Deve ser o último middleware registrado
 */
const globalErrorHandler = (err, req, res, next) => {
  const errorId = req.id || `err-${Date.now()}`;
  
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;
  
  // Tratamento específico por tipo de erro
  if (err.name === 'ValidationError' || code === 'VALIDATION_ERROR') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request data';
    details = err.details || err.errors;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Authentication required';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    code = 'FORBIDDEN';
    message = 'Access denied';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    code = 'SERVICE_UNAVAILABLE';
    message = 'Service temporarily unavailable';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    code = 'CONFLICT';
    message = 'Resource already exists';
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    code = 'SYNTAX_ERROR';
    message = 'Invalid JSON or request format';
  }
  
  // Log estruturado
  const logContext = {
    errorId,
    statusCode,
    code,
    message,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  if (statusCode >= 500) {
    logger.error('Application Error', {
      ...logContext,
      stack: err.stack,
      details: err
    });
    // Também enviar para Sentry
    if (Sentry) {
      Sentry.captureException(err, { 
        tags: { errorId, code },
        contexts: { request: logContext }
      });
    }
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logContext);
  }
  
  // Response
  res.status(statusCode).json({
    success: false,
    error: message,
    code,
    errorId,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    // Em produção, não retorne detalhes internos
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack?.split('\n').slice(0, 5)
    })
  });
};

/**
 * Middleware para validar schema
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { valid, errors } = InputValidator.validate(req.body, schema);
    if (!valid) {
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors));
    }
    next();
  };
};

/**
 * Middleware para rate limiting por rota
 */
const createRateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    const userRequests = requests.get(key) || [];
    
    // Remover requisições fora da janela
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    // Cleanup de memória a cada 1000 requisições
    if (requests.size > 1000) {
      const allKeys = Array.from(requests.keys());
      allKeys.slice(0, 100).forEach(k => requests.delete(k));
    }
    
    next();
  };
};

/**
 * Async route wrapper para capturar erros
 * USO: router.post('/route', asyncHandler(controller.action))
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Enhanced async handler com validação e sanitização
 */
const createAsyncHandler = (fn, options = {}) => {
  return async (req, res, next) => {
    try {
      // Validar schema se fornecido
      if (options.schema) {
        const { valid, errors } = InputValidator.validate(req.body, options.schema);
        if (!valid) {
          throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
        }
      }
      
      // Executar handler
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  globalErrorHandler,
  handle404,
  AppError,
  asyncHandler,
  createAsyncHandler,
  sanitizeInput,
  validateSchema,
  createRateLimiter
};
