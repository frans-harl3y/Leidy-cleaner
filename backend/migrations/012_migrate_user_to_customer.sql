-- Migration: migrate legacy 'user' role to 'customer'
BEGIN;
UPDATE users SET role = 'customer' WHERE role = 'user';
COMMIT;
