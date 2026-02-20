import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { sanitizeInput } from './middleware/sanitize';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import bookingsRoutes from './routes/bookings';
import paymentsRoutes from './routes/payments';
import companyRoutes from './routes/company';
import adminRoutes from './routes/admin';
import reviewsRoutes from './routes/reviews';
import staffRoutes from './routes/staff';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sem origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://vammos.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Mais restritivo para auth
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Mais permissivo para API
  message: 'API rate limit exceeded.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiLimiter);
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Input sanitization
app.use(sanitizeInput);

// static file serving for uploads
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint (público)
app.get('/health', async (_req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: false,
      memory: true,
      disk: true
    }
  };

  try {
    // Verificar conectividade com banco
    const { query } = require('./utils/database');
    logger.info('Testing database connection...');
    // Small delay for SQLite initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    const result = await query('SELECT 1 as test');
    logger.info('Database test result:', result);
    health.checks.database = true;
  } catch (error) {
    health.status = 'error';
    health.checks.database = false;
    logger.error('Health check failed - Database error details:', error.message);
    logger.error('DB_TYPE:', process.env.DB_TYPE);
    logger.error('DATABASE_LOCAL:', process.env.DATABASE_LOCAL);
  }

  // Verificar uso de memória
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  // Alerta se heap usado > 80%
  if (memUsage.heapUsed / memUsage.heapTotal > 0.8) {
    health.checks.memory = false;
    health.status = 'warning';
  }

  const statusCode = health.status === 'ok' ? 200 : health.status === 'warning' ? 200 : 503;

  res.status(statusCode).json({
    ...health,
    memory: memUsageMB
  });
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/bookings', bookingsRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/staff', staffRoutes);

// Status endpoint
app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.json({
    message: 'Vammos API v1',
    status: 'running',
    version: '2.0.0',
    features: {
      auth: 'JWT + Refresh Tokens',
      services: 'CRUD operations',
      database: 'PostgreSQL 15',
      cache: 'Redis 7'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`✅ Backend running on http://localhost:${PORT}`);
  logger.info(`📚 API: http://localhost:${PORT}/api/v1`);
  logger.info(`💚 Health: http://localhost:${PORT}/health`);
  logger.info(`📊 Status: http://localhost:${PORT}/api/v1/status`);
  logger.info(`🔐 Auth: http://localhost:${PORT}/api/v1/auth`);
  logger.info(`🛍️  Services: http://localhost:${PORT}/api/v1/services`);
});

export default app;
