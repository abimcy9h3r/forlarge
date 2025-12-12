-- Add columns for hybrid file upload system
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS external_file_url TEXT,
ADD COLUMN IF NOT EXISTS preview_file_url TEXT,
ADD COLUMN IF NOT EXISTS file_size_mb DECIMAL(10, 2);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Create transactions table for payment tracking
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_wallet_address TEXT NOT NULL,
  seller_wallet_address TEXT NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  currency TEXT NOT NULL,
  chain TEXT NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending',
  platform_fee DECIMAL(18, 6),
  creator_amount DECIMAL(18, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON public.transactions(buyer_wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON public.transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON public.transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Create download access table
CREATE TABLE IF NOT EXISTS public.download_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_wallet_address TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_download_access_token ON public.download_access(access_token);
CREATE INDEX IF NOT EXISTS idx_download_access_buyer ON public.download_access(buyer_wallet_address);

-- Enable RLS on new tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions as buyer"
  ON public.transactions FOR SELECT
  USING (buyer_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view their own transactions as seller"
  ON public.transactions FOR SELECT
  USING (
    seller_wallet_address IN (
      SELECT wallet_address FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update transactions"
  ON public.transactions FOR UPDATE
  USING (true);

-- RLS Policies for download_access
CREATE POLICY "Users can view their own download access"
  ON public.download_access FOR SELECT
  USING (buyer_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage download access"
  ON public.download_access FOR ALL
  USING (true);
