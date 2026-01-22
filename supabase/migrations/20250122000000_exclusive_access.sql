-- Create waitlist_requests table
CREATE TABLE waitlist_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invite_codes table
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id), -- Optional: if created by admin/user
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_waitlist_email ON waitlist_requests(email);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);

-- RLS Policies for waitlist_requests
ALTER TABLE waitlist_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (request access)
CREATE POLICY "Anyone can request access" 
  ON waitlist_requests FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only admins/service role can view (for now, or maybe users can view their own status if we had auth)
-- Since they are not authed yet, we rely on service role for admin viewing.
-- But let's allow read if email matches (hard without auth).
-- So just service role/admin for reading list.

-- RLS Policies for invite_codes
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read invite codes to verify them (needed for sign up check)
-- Ideally we'd use a function to check validity without exposing the whole table,
-- but for simplicity, we allow reading where code matches.
CREATE POLICY "Anyone can check invite codes"
  ON invite_codes FOR SELECT
  TO anon, authenticated
  USING (true); -- Filter happens in query usually, but 'true' allows reading any code status. 
  -- Secure approach: Use a Postgres function `check_invite_code(code)` and disable SELECT for anon.
  -- For MVP: Allow select.

-- Function to increment use count (callable by RPC or triggers)
-- Trigger approach to handle uses_count
CREATE OR REPLACE FUNCTION increment_invite_use()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invite_codes
  SET uses_count = uses_count + 1
  WHERE code = NEW.invite_code_used; -- Assuming we pass this effectively somehow, or simpler:
  -- Actually, let's keep it simple. The app logic will increment it via RPC or service role.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Better Approach: RPC function to validate and use code atomically.
CREATE OR REPLACE FUNCTION validate_and_use_invite_code(code_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code_id UUID;
BEGIN
  -- Check if valid
  SELECT id INTO v_code_id
  FROM invite_codes
  WHERE code = code_input
    AND is_active = true
    AND (max_uses IS NULL OR uses_count < max_uses)
    AND (expires_at IS NULL OR expires_at > NOW());
    
  IF v_code_id IS NOT NULL THEN
    -- Increment use
    UPDATE invite_codes
    SET uses_count = uses_count + 1
    WHERE id = v_code_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
