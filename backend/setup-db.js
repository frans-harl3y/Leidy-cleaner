const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'leidycleaner_dev',
    user: 'postgres',
    password: 'postgres',
  });

  try {
    console.log('🧹 Dropping existing tables...');
    await pool.query(`
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS company_info CASCADE;
      DROP TABLE IF EXISTS staff_availability CASCADE;
    `);
    console.log('✅ Tables dropped');

    console.log('📋 Creating migrations table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🔄 Reading migration files...');
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      console.log(`🚀 Executing ${file}...`);
      await pool.query(sql);
    }

    console.log('✅ Database setup complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
