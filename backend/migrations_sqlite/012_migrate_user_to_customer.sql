-- Migration: migrate legacy 'user' role to 'customer' (SQLite)
BEGIN TRANSACTION;
UPDATE users SET role = 'customer' WHERE role = 'user';
COMMIT;
