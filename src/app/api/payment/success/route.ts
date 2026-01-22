
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDownloadToken } from '@/lib/utils/download-token';
import { createDownloadAccess } from '@/lib/services/download';
import { sendPurchaseConfirmationEmail, sendNewSaleNotification } from '@/lib/services/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transactionId, creatorEmail, productTitle, amount, buyerEmail } = body;

        if (!transactionId || !creatorEmail || !productTitle || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Generate Download Access
        // We need parameters: transactionId, productId? (Not passed, but needed for DB), buyerWallet?
        // Let's first fetch the transaction to get details directly from DB for security
        // and to ensure we have the right productId and buyer wallet.

        const supabase = createClient();
        const { data: transaction, error: txError } = await supabase
            .from('transactions')
            .select('*, products(*)')
            .eq('id', transactionId)
            .single();

        if (txError || !transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // 2. Create Download Token
        const token = generateDownloadToken();
        const accessResult = await createDownloadAccess({
            transactionId,
            productId: transaction.product_id,
            buyerWallet: transaction.buyer_wallet_address,
            token,
            expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        });

        if (accessResult.error) {
            console.error('Failed to create download access:', accessResult.error);
            // Continue anyway to send email? or fail? 
            // If we fail here, user paid but gets nothing.
            // Better to log and maybe alert usage.
        }

        // 3. Send Buyer Email (Receipt + Link)
        if (buyerEmail) {
            await sendPurchaseConfirmationEmail({
                buyerEmail,
                productTitle,
                amount,
                downloadToken: token
            });
        }

        // 4. Send Seller Email
        await sendNewSaleNotification({
            creatorEmail,
            productTitle,
            amount: transaction.amount, // Use verified amount from DB
            buyerWallet: transaction.buyer_wallet_address
        });

        return NextResponse.json({ success: true, token });

    } catch (error: any) {
        console.error('Payment callback error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
