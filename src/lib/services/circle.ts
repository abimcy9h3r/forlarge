import { initiateDeveloperControlledWalletsClient } from '@circle-fin/circle-sdk';

const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY || 'TEST_API_KEY:53f3700ad71c935dbe30c835ceea9f15:97790d51a91d7ae41954771e3b3696bd',
  entitySecret: process.env.CIRCLE_ENTITY_SECRET || '',
});

export interface CreatePaymentParams {
  amount: string;
  currency: string;
  recipientAddress: string;
  productId: string;
  buyerEmail?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function createUSDCPayment(params: CreatePaymentParams): Promise<PaymentResult> {
  try {
    const response = await circleClient.createTransaction({
      amounts: [params.amount],
      destinationAddress: params.recipientAddress,
      tokenId: 'USDC',
      walletId: process.env.CIRCLE_WALLET_ID || '',
      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM',
        },
      },
    });

    if (response.data?.id) {
      return {
        success: true,
        transactionId: response.data.id,
      };
    }

    return {
      success: false,
      error: 'Failed to create transaction',
    };
  } catch (error: any) {
    console.error('Circle payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

export async function getTransactionStatus(transactionId: string) {
  try {
    const response = await circleClient.getTransaction({
      id: transactionId,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return null;
  }
}
