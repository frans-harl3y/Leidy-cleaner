-- Add moderation and image support to reviews
-- Add moderation and image support to reviews (SQLite compatible)
ALTER TABLE reviews ADD COLUMN is_approved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE reviews ADD COLUMN images TEXT;

-- index for approval
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
