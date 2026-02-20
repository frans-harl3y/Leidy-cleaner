import dotenv from 'dotenv';
dotenv.config();

console.log('DB_TYPE after dotenv:', process.env.DB_TYPE);

import { query } from './src/utils/database';

async function test() {
  try {
    console.log('Testing database connection...');
    console.log('DB_TYPE:', process.env.DB_TYPE);
    console.log('DATABASE_LOCAL:', process.env.DATABASE_LOCAL);

    const result = await query('SELECT 1 as test');
    console.log('Query result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();