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
function validateRegisterData(data: any) {
  const { email, password, name, phone } = data;
  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  return { email, password, name, phone };
}

// Hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
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
    const { email, password, name, phone } = validateRegisterData(body);

    // Check if user already exists
    const existingUsers = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.rows.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Determine role: first registered user becomes admin
    const adminCheck = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const roleToAssign = parseInt(adminCheck.rows[0].count) === 0 ? 'admin' : 'user';

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, full_name, phone, role, created_at`,
      [email, passwordHash, name, phone || null, roleToAssign]
    );

    const user = result.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    return NextResponse.json({
      message: 'User registered successfully',
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
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await pool.end();
  }
}