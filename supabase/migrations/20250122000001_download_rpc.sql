
-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(token_input TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE download_access
  SET download_count = download_count + 1
  WHERE access_token = token_input;
END;
$$;
