-- Create Company Info Table
CREATE TABLE IF NOT EXISTS company_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT(255) NOT NULL,
  legal_name TEXT(255),
  email TEXT(255),
  phone TEXT(100),
  address TEXT,
  city TEXT(100),
  state TEXT(100),
  country TEXT(100),
  postal_code TEXT(50),
  logo_url TEXT,
  description TEXT,
  terms TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
