-- Add username field for creator store links
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON auth.users(username);

-- Add username to products table for easier queries
ALTER TABLE products ADD COLUMN IF NOT EXISTS creator_username TEXT;

-- Create index for creator username on products
CREATE INDEX IF NOT EXISTS idx_products_creator_username ON products(creator_username);

-- Function to sync username from auth.users to products
CREATE OR REPLACE FUNCTION sync_creator_username()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET creator_username = (
    SELECT username FROM auth.users WHERE id = NEW.user_id
  )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync username when user updates their profile
CREATE TRIGGER sync_username_to_products
AFTER UPDATE OF username ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_creator_username();
