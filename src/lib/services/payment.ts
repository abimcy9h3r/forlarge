import { createClient } from '@/lib/supabase/client';
import { PLATFORM_FEE_PERCENTAGE } from '@/lib/config/chains';

export interface PaymentDetails {
  productId: string;
  productPrice: number;
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  txHash: string;
  chain: 'base' | 'solana';
}

export async function recordPayment(details: PaymentDetails) {
  const supabase = createClient();

  const platformFee = (details.productPrice * PLATFORM_FEE_PERCENTAGE) / 100;
  const creatorAmount = details.productPrice - platformFee;

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      product_id: details.productId,
      buyer_wallet_address: details.buyerWalletAddress,
      seller_wallet_address: details.sellerWalletAddress,
      amount: details.productPrice,
      currency: 'USDC',
      chain: details.chain,
      tx_hash: details.txHash,
      status: 'pending',
      platform_fee: platformFee,
      creator_amount: creatorAmount,
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording payment:', error);
    return { success: false, error: error.message };
  }

  return { success: true, transaction: data };
}

export async function confirmPayment(txHash: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('transactions')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    })
    .eq('tx_hash', txHash)
    .select()
    .single();

  if (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error: error.message };
  }

  return { success: true, transaction: data };
}

export async function getTransactionByHash(txHash: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(`*`)
    .eq('tx_hash', txHash)
    .single();

  if (error) {
    return null;
  }

  return data;
}
