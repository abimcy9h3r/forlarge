
import { createClient } from '@/lib/supabase/client';

export interface DownloadAccess {
  transactionId: string;
  productId: string;
  buyerWallet: string;
  token: string;
  expiresIn?: number; // duration in ms
}

export async function createDownloadAccess({
  transactionId,
  productId,
  buyerWallet,
  token,
  expiresIn = 24 * 60 * 60 * 1000 // 24 hours
}: DownloadAccess) {
  const supabase = createClient();

  const expiresAt = new Date(Date.now() + expiresIn).toISOString();

  const { data, error } = await supabase
    .from('download_access')
    .insert({
      transaction_id: transactionId,
      product_id: productId,
      buyer_wallet_address: buyerWallet,
      access_token: token,
      expires_at: expiresAt,
      max_downloads: 5,
      download_count: 0
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function validateDownloadToken(token: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('download_access')
    .select(`
      *,
      products (
        id,
        title,
        description,
        file_url,
        file_type,
        external_file_url,
        cover_image_url
      )
    `)
    .eq('access_token', token)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid token' };
  }

  // Check Expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Download link expired' };
  }

  // Check Max Downloads
  if (data.max_downloads && data.download_count >= data.max_downloads) {
    return { valid: false, error: 'Max download limit reached' };
  }

  return { valid: true, data };
}

export async function consumeDownloadToken(token: string) {
  const supabase = createClient();

  // Need to increment download_count safely
  // We can use an RPC or just read-increment-write for MVP if race conditions aren't critical
  // Or raw SQL via rpc if available.

  // Simple update:
  const { data, error } = await supabase.rpc('increment_download_count', { token_input: token });

  if (error) {
    // If RPC missing, try manual update
    // Note: Assuming we have permissions or this runs server-side (it should).
    // Actually, this file uses 'createClient' from client.ts which is generic.
    // If running in browser, might be blocked by RLS if not careful.
    // Ideally this runs in an API route or Server Action.
    console.error('Failed to increment download count via RPC', error);
  }

  return { success: !error };
}
