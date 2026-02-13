/**
 * Async Request Handler Wrapper
 * Envolve handlers async para capturar erros e passar para o error handler global
 */

/**
 * Wrapper para rotas async
 * Garante que erros em promises sejam capturados
 * @param {Function} fn - Controller function
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Wrapper com validação de entrada
 * @param {Function} fn - Controller function
 * @param {Array} requiredFields - Campos obrigatórios para validar
 * @returns {Function} Express middleware
 */
const validatedAsyncHandler = (fn, requiredFields = []) => (req, res, next) => {
  try {
    // Validação básica de campos obrigatórios
    if (requiredFields.length > 0) {
      const errors = [];
      requiredFields.forEach(field => {
        if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
          errors.push(`Campo obrigatório faltando: ${field}`);
        }
      });
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          details: errors,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Executar handler
    Promise.resolve(fn(req, res, next)).catch(next);
  } catch (err) {
    next(err);
  }
};

/**
 * Wrapper com try-catch e logging
 * @param {Function} fn - Controller function
 * @returns {Function} Express middleware
 */
const safeAsyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Log detalhado do erro
    const logger = require('../utils/logger');
    logger.error('Erro não capturado em handler:', {
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query
    });

    // Passar para error handler
    next(error);
  }
};

/**
 * Validador de dados com sanitização
 * @param {Array} schema - Array de validações [{field, type, required, min, max, pattern}]
 * @returns {Function} Express middleware
 */
const validateSchema = (schema) => (req, res, next) => {
  const errors = [];

  schema.forEach(({ field, type, required, min, max, pattern, sanitize }) => {
    const value = req.body[field];

    // Verificar se obrigatório
    if (required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: 'Campo obrigatório' });
      return;
    }

    // Se não obrigatório e vazio, pular validação
    if (!required && (value === undefined || value === null || value === '')) {
      return;
    }

    // Verificar tipo
    if (type && typeof value !== type) {
      errors.push({ field, message: `Tipo deve ser ${type}` });
      return;
    }

    // Verificar comprimento mínimo/máximo
    if (type === 'string') {
      if (min && value.length < min) {
        errors.push({ field, message: `Mínimo ${min} caracteres` });
      }
      if (max && value.length > max) {
        errors.push({ field, message: `Máximo ${max} caracteres` });
      }
    }

    // Verificar padrão regex
    if (pattern && !pattern.test(value)) {
      errors.push({ field, message: 'Formato inválido' });
    }

    // Sanitizar se necessário
    if (sanitize && type === 'string') {
      req.body[field] = sanitizeString(value);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validação falhou',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

/**
 * Sanitizar string para remover XSS
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizada
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/[<>\"']/g, char => {
      const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char];
    })
    .trim();
}

/**
 * Middleware para limpar dados de resposta
 * Remove campos sensíveis
 * @param {Array} fieldsToRemove - Campos para remover
 * @returns {Function} Express middleware
 */
const cleanResponseData = (fieldsToRemove = ['password', 'token', 'secret']) => (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    if (data && typeof data === 'object') {
      const cleaned = JSON.parse(JSON.stringify(data));
      
      const removeFields = (obj) => {
        if (Array.isArray(obj)) {
          obj.forEach(removeFields);
        } else if (obj && typeof obj === 'object') {
          fieldsToRemove.forEach(field => {
            delete obj[field];
          });
          Object.values(obj).forEach(removeFields);
        }
      };

      removeFields(cleaned);
      return originalJson.call(this, cleaned);
    }
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Middleware para validar auth token
 * @returns {Function} Express middleware
 */
const validateAuthToken = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Sem token de autenticação',
      timestamp: new Date().toISOString()
    });
  }

  // Token será validado pelo middleware de auth existente
  next();
};

/**
 * Middleware para rate limiting por rota
 * @param {number} maxRequests - Máximo de requisições
 * @param {number} windowMs - Janela de tempo em ms
 * @returns {Function} Express middleware
 */
const routeRateLimit = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    const userRequests = requests.get(key) || [];

    // Limpar requisições antigas
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Muitas requisições. Tente novamente mais tarde',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
        timestamp: new Date().toISOString()
      });
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
};

module.exports = {
  asyncHandler,
  validatedAsyncHandler,
  safeAsyncHandler,
  validateSchema,
  sanitizeString,
  cleanResponseData,
  validateAuthToken,
  routeRateLimit
};
