import { NextRequest, NextResponse } from 'next/server';
import { createUSDCPayment } from '@/lib/services/circle';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, chain, recipientAddress, metadata } = body;

    // Validate required fields
    if (!amount || !currency || !chain || !recipientAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment with Circle
    const payment = await createUSDCPayment({
      amount,
      currency,
      recipientAddress,
      productId: metadata?.productId || '',
      buyerEmail: metadata?.buyerEmail
    });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
