import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

const { Pool } = pg;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'leidycleaner_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

// Simple validation
function validateLoginData(data: any) {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  return { email, password };
}

// Compare password
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate tokens
function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'dev_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    { expiresIn: '7d' } as SignOptions
  );

  return { accessToken, refreshToken };
}

export async function POST(request: NextRequest) {
  const pool = new Pool(dbConfig);

  try {
    const body = await request.json();
    const { email, password } = validateLoginData(body);

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, phone, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    return NextResponse.json({
      message: 'User logged in successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          phone: user.phone,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await pool.end();
  }
}