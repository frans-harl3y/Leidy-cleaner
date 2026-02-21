import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';

const { Pool } = pg;

// Simple database connection for health check
async function testDatabaseConnection() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'leidycleaner_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };

  const pool = new Pool(dbConfig);

  try {
    const result = await pool.query('SELECT 1 as test');
    await pool.end();
    return true;
  } catch (error) {
    await pool.end();
    throw error;
  }
}

// Health check logic
async function getHealthStatus() {
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
    // Test database connection
    await testDatabaseConnection();
    health.checks.database = true;
  } catch (error) {
    health.status = 'error';
    health.checks.database = false;
    console.error('Health check failed - Database error:', (error as Error).message);
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  // Alert if heap used > 80%
  if (memUsage.heapUsed / memUsage.heapTotal > 0.8) {
    health.checks.memory = false;
    health.status = 'warning';
  }

  const statusCode = health.status === 'ok' ? 200 : health.status === 'warning' ? 200 : 503;

  return { health: { ...health, memory: memUsageMB }, statusCode };
}

export async function GET() {
  try {
    const { health, statusCode } = await getHealthStatus();
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    console.error('Health route error:', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 503 });
  }
}