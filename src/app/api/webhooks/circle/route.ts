import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmationEmail } from '@/lib/services/email';
import { generateDownloadToken } from '@/lib/utils/download-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (Circle provides this)
    const signature = request.headers.get('circle-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // TODO: Verify signature with Circle's public key
    // For now, we'll process the webhook

    const { type, data } = body;

    if (type === 'payment.confirmed') {
      const supabase = createClient();
      
      const {
        id: paymentId,
        amount,
        currency,
        metadata,
        transactionHash,
        status
      } = data;

      // Get transaction from database
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select('*, products(*)')
        .eq('tx_hash', transactionHash)
        .single();

      if (txError || !transaction) {
        console.error('Transaction not found:', txError);
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Failed to update transaction:', updateError);
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
      }

      // Generate download access token
      const token = generateDownloadToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

      const { error: accessError } = await supabase
        .from('download_access')
        .insert({
          transaction_id: transaction.id,
          product_id: transaction.product_id,
          buyer_wallet_address: transaction.buyer_wallet_address,
          access_token: token,
          expires_at: expiresAt.toISOString(),
          max_downloads: 5
        });

      if (accessError) {
        console.error('Failed to create download access:', accessError);
        return NextResponse.json({ error: 'Failed to create download access' }, { status: 500 });
      }

      // Send confirmation email
      try {
        await sendPurchaseConfirmationEmail({
          buyerEmail: metadata?.buyerEmail || '',
          productTitle: transaction.products.title,
          amount: transaction.amount,
          downloadToken: token
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the webhook if email fails
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
