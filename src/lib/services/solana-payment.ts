import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram
} from '@solana/web3.js';
import {
    createTransferCheckedInstruction,
    getAssociatedTokenAddress,
    getMint
} from '@solana/spl-token';
import { USDC_ADDRESSES, PLATFORM_WALLETS, PLATFORM_FEE_PERCENTAGE } from '../config/chains';

// Default RPC (should override with env var)
const SOLANA_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

export async function createSolanaPaymentTransaction({
    buyerPublicKey,
    sellerWallet,
    amount
}: {
    buyerPublicKey: PublicKey;
    sellerWallet: string;
    amount: number;
}) {
    const connection = new Connection(SOLANA_RPC, 'confirmed');
    const usdcMint = new PublicKey(USDC_ADDRESSES.solana);
    const buyerKey = new PublicKey(buyerPublicKey);
    const sellerKey = new PublicKey(sellerWallet);
    const platformKey = new PublicKey(PLATFORM_WALLETS.solana);

    // Get Token Accounts
    const buyerATA = await getAssociatedTokenAddress(usdcMint, buyerKey);
    const sellerATA = await getAssociatedTokenAddress(usdcMint, sellerKey);
    const platformATA = await getAssociatedTokenAddress(usdcMint, platformKey);

    // Get Mint Info for Decimals
    const mintInfo = await getMint(connection, usdcMint);
    const decimals = mintInfo.decimals;

    // Calculate Amounts
    // Amount is in USDC (e.g. 10.50). Convert to Base Units (e.g. 10500000)
    const totalAmountBase = Math.floor(amount * Math.pow(10, decimals));
    const platformFeeBase = Math.floor(totalAmountBase * PLATFORM_FEE_PERCENTAGE);
    const sellerAmountBase = totalAmountBase - platformFeeBase;

    const transaction = new Transaction();

    // 1. Transfer to Seller
    transaction.add(
        createTransferCheckedInstruction(
            buyerATA,
            usdcMint,
            sellerATA,
            buyerKey,
            sellerAmountBase,
            decimals
        )
    );

    // 2. Transfer to Platform
    if (platformFeeBase > 0) {
        transaction.add(
            createTransferCheckedInstruction(
                buyerATA,
                usdcMint,
                platformATA,
                buyerKey,
                platformFeeBase,
                decimals
            )
        );
    }

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerKey;

    return transaction;
}
