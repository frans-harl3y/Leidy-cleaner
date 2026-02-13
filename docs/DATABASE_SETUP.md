# 🗄️ PostgreSQL Database Setup Guide

**Estimated time**: 20 minutes  
**Difficulty**: Intermediate  
**Production-ready**: Yes

---

## 1️⃣ Choose Your Database Provider

### Option A: Railway (Recommended for beginners)
```bash
Railway Dashboard → + New → Database → PostgreSQL
# Auto-generates DATABASE_URL
```

### Option B: Supabase (Best features for free tier)
```
Go to https://supabase.com
Sign up → New project → copy DATABASE_URL
Includes: Vector DBs, REST API, Realtime subscriptions
Free tier: 5GB storage
```

### Option C: Heroku Postgres (Phasing out - not recommended)
```
Legacy option, being discontinued
New: Use Railway or Supabase instead
```

### Option D: Self-hosted (Advanced)
```bash
# On your VPS
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Connection:
DATABASE_URL=postgresql://postgres:password@localhost:5432/chega
```

---

## 2️⃣ Get Your Connection String

### Railway
```
Dashboard → [database] → Connect
Copy: "Postgres (psql)"
```

### Supabase
```
Project settings → Database → Connection string
Copy the "URI" option
```

### Format (Universal)
```
postgresql://username:password@host:port/database

# Example:
postgresql://postgres:mypassword123@db.railway.internal:5432/railway
```

---

## 3️⃣ Update Backend Configuration

### Create `backend/src/db/migrations/init.sql`

```sql
-- ===== USERS TABLE =====
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  photo_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- ===== BOOKINGS TABLE =====
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_scheduled_at (scheduled_at),
  INDEX idx_status (status)
);

-- ===== PAYMENTS TABLE =====
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255) UNIQUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_booking_id (booking_id),
  INDEX idx_stripe_payment_id (stripe_payment_id)
);

-- ===== MESSAGES TABLE =====
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_created_at (created_at)
);

-- ===== NOTIFICATIONS TABLE =====
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===== SESSIONS TABLE (Optional - for session management) =====
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Create indexes for performance
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_messages_room ON messages(sender_id, receiver_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at);
```

---

## 4️⃣ Create Migration Runner

### Create `backend/src/db/migrate.js`

```javascript
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  idleTimeoutMillis: 30000,
  query_timeout: 30000,
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running migrations...');
    
    // Create migrations table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    for (const file of files) {
      const result = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [file]
      );
      
      if (result.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }
      
      console.log(`▶️  Executing ${file}...`);
      const sql = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );
      
      await client.query(sql);
      await client.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [file]
      );
      
      console.log(`✅ ${file} complete`);
    }
    
    console.log('✅ All migrations completed successfully!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
```

---

## 5️⃣ Run Migrations

### Option 1: Local testing (with SQLite)
```bash
export DATABASE_URL=sqlite:///chega.db
npm run migrate
```

### Option 2: Railway
```bash
# Via Railway CLI
railway run npm run migrate

# Via Railway Dashboard
1. Settings → Deploy Trigger
2. Add command: npm run migrate
```

### Option 3: Supabase
```bash
# Connect directly
psql $DATABASE_URL < backend/src/db/migrations/init.sql

# Or via dashboard
1. SQL Editor
2. Paste init.sql
3. Run
```

### Option 4: Manual PostgreSQL
```bash
psql postgresql://user:pass@host:port/db < init.sql
```

---

## 6️⃣ Verify Migration

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Check schema
\d users

# Run query
SELECT COUNT(*) FROM users;

# Exit
\q
```

---

## 7️⃣ Create Seed Data (Optional)

### Create `backend/src/db/seed.js`

```javascript
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding database...');
    
    // Check if data exists
    const result = await client.query('SELECT COUNT(*) FROM users');
    if (result.rows[0].count > 0) {
      console.log('🚫 Database already seeded. Aborting.');
      return;
    }
    
    // Create test user
    const password = await bcrypt.hash('password123', 12);
    
    const user = await client.query(
      `INSERT INTO users (email, password_hash, name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ['admin@example.com', password, 'Admin User', '+5511999999999']
    );
    
    console.log('✅ Seed user created:', user.rows[0].email);
    console.log('✅ Password: password123');
    console.log('✅ Database seeded!');
    
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
```

---

## 8️⃣ Update `package.json`

```json
{
  "scripts": {
    "migrate": "node backend/src/db/migrate.js",
    "seed": "node backend/src/db/seed.js",
    "db:setup": "npm run migrate && npm run seed",
    "db:reset": "npm run db:drop && npm run db:setup"
  }
}
```

---

## 9️⃣ Connection String Template

Save to `backend/.env`:

```bash
# ===== DATABASE =====
DATABASE_URL=postgresql://username:password@host:port/database

# Examples:
# Railway:    postgresql://postgres:xxxx@db.railway.internal:5432/railway
# Supabase:   postgresql://postgres:xxxx@db.supabase.co:5432/postgres
# Local:      postgresql://postgres:password@localhost:5432/chega
# Heroku:     postgresql://user:password@ec2-xxx.compute-1.amazonaws.com:5432/db1234

# ===== CONNECTION POOL =====
DB_POOL_MIN=2
DB_POOL_MAX=30
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=5000
```

---

## 🔟 Testing Connection

```bash
# Test with psql
psql $DATABASE_URL -c "SELECT NOW();"

# Test with Node
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? '❌' : '✅', err ? err.message : 'Connected!');
  process.exit(0);
});
"

# Success output: ✅ Connected!
```

---

## Backup & Recovery

### Automated Backup (Railway/Supabase)
```
Included automatically
Accessible in Dashboard → Backups
```

### Manual Backup
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
```

### Restore from Backup
```bash
psql $DATABASE_URL < backup-20240115-143215.sql
```

---

## Troubleshooting

### "FATAL: remaining connection slots reserved"
```bash
# Too many connections
# Reduce pool size in .env
DB_POOL_MAX=10  # default 30
```

### "Connection timeout"
```bash
# Check host is accessible
psql -h host -p 5432 -U user -d database

# Check firewall
nc -zv host 5432
```

### "database does not exist"
```bash
# Create it (if not Railway/Supabase)
psql -U postgres -c "CREATE DATABASE chega;"

# Or specify in connection string
DATABASE_URL=postgresql://user:pass@host:5432/chega
```

### "permission denied"
```bash
# User needs CREATE TABLE permission
psql -U postgres -d postgres -c \
  "ALTER USER username WITH CREATEDB;"
```

---

**Next**: Configure [Stripe test keys](./STRIPE_SETUP.md)
