import { createClient } from '@/lib/supabase/client';
import { generateDownloadToken, generateAccessExpiry } from '@/lib/utils/download-token';

export async function createDownloadAccess(transactionId: string, productId: string, buyerWalletAddress: string) {
  const supabase = createClient();
  const token = generateDownloadToken();
  const expiresAt = generateAccessExpiry(24); // 24 hours

  const { data, error } = await supabase
    .from('download_access')
    .insert({
      transaction_id: transactionId,
      product_id: productId,
      buyer_wallet_address: buyerWalletAddress,
      access_token: token,
      expires_at: expiresAt.toISOString(),
      max_downloads: 5,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating download access:', error);
    return { success: false, error: error.message };
  }

  return { success: true, token, downloadAccess: data };
}

export async function validateDownloadToken(token: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('download_access')
    .select('*, products(*)')
    .eq('access_token', token)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid token' };
  }

  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (now > expiresAt) {
    return { valid: false, error: 'Token expired' };
  }

  if (data.download_count >= data.max_downloads) {
    return { valid: false, error: 'Download limit reached' };
  }

  return { valid: true, downloadAccess: data };
}

export async function incrementDownloadCount(token: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('download_access')
    .update({
      download_count: supabase.rpc('increment', { row_id: token }),
    })
    .eq('access_token', token)
    .select()
    .single();

  if (error) {
    console.error('Error incrementing download count:', error);
    return { success: false };
  }

  return { success: true, downloadAccess: data };
}
