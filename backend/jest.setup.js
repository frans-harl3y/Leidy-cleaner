// Jest setup after environment is ready.
// Place global mocks or test utilities here.
jest.setTimeout(60000); // Increased timeout to 60 seconds

// Ensure test environment variables are loaded
require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

const { Pool } = require('pg');

const pool = new Pool({
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	database: process.env.DB_NAME || 'postgres',
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
});

beforeAll(async () => {
	try {
		console.log('🧹 Setting up test database...');
		// Ensure a clean state once per worker (do not remove data between tests in same file)
		await pool.query('TRUNCATE TABLE bookings, reviews, services, users RESTART IDENTITY CASCADE');
		console.log('✅ Database truncated successfully');

		// Reseed default data
		console.log('🌱 Seeding test data...');
		// Set environment variables explicitly for the seed process
		process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/postgres';
		process.env.DB_HOST = 'localhost';
		process.env.DB_PORT = '5432';
		process.env.DB_NAME = 'postgres';
		process.env.DB_USER = 'postgres';
		process.env.DB_PASSWORD = 'postgres';
		process.env.NODE_ENV = 'test';
		
		// Clear require cache to ensure fresh load
		delete require.cache[require.resolve('./src/db/seed')];
		delete require.cache[require.resolve('./src/utils/database')];
		delete require.cache[require.resolve('./src/utils/logger')];
		
		const { seedDatabase } = require('./src/db/seed');
		await seedDatabase();
		console.log('✅ Test data seeded successfully');
	} catch (err) {
		console.error('❌ Error in beforeAll:', err.message);
		console.error('Stack:', err.stack);
		throw err;
	}
});

afterAll(async () => {
	try {
		await pool.end();
		console.log('✅ Database connection closed');
	} catch (err) {
		console.error('❌ Error closing database:', err.message);
	}
});