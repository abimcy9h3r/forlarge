import { parseUnits } from 'viem';
import { USDC_ADDRESSES } from '../config/chains';

export function getBasePaymentDetails({
    sellerWallet,
    amount
}: {
    sellerWallet: string;
    amount: number;
}) {
    // For MVP, we send 100% to seller directly
    // Fee enforcement to be added later via Smart Contract

    const usdcAddress = USDC_ADDRESSES.base;
    const amountInWei = parseUnits(amount.toString(), 6); // USDC has 6 decimals on Base/ETH usually

    return {
        tokenAddress: usdcAddress,
        recipient: sellerWallet,
        amount: amountInWei
    };
}
