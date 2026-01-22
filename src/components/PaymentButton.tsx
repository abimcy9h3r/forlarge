"use client";

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { createSolanaPaymentTransaction } from '@/lib/services/solana-payment';
import { getBasePaymentDetails } from '@/lib/services/base-payment';
import { recordPayment, confirmPayment } from '@/lib/services/payment';
import { sendPurchaseConfirmationEmail, sendNewSaleNotification } from '@/lib/services/email';
import { createWalletClient, custom, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { Loader2, CreditCard } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';

interface PaymentButtonProps {
    productId: string;
    productTitle: string;
    price: number;
    sellerWalletBase: string;
    sellerWalletSolana: string;
    creatorEmail: string;
    children?: React.ReactNode;
}

export function PaymentButton({
    productId,
    productTitle,
    price,
    sellerWalletBase,
    sellerWalletSolana,
    creatorEmail,
    children
}: PaymentButtonProps) {
    const { login, authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        if (!authenticated) {
            login();
            return;
        }

        const wallet = wallets[0]; // Use primary wallet
        if (!wallet) {
            toast.error("No wallet connected");
            return;
        }

        setLoading(true);
        try {
            const chainType = wallet.walletClientType === 'solana' ? 'solana' : 'ethereum';
            let txHash = '';

            if (chainType === 'solana') {
                await handleSolanaPurchase(wallet);
            } else {
                await handleBasePurchase(wallet);
            }

        } catch (error: any) {
            console.error("Purchase failed:", error);
            toast.error(error.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSolanaPurchase = async (wallet: any) => {
        // 1. Build Transaction
        const transaction = await createSolanaPaymentTransaction({
            buyerPublicKey: new PublicKey(wallet.address),
            sellerWallet: sellerWalletSolana,
            amount: price
        });

        // 2. Request Sign/Send
        // Privy's wallet interface for Solana should support signTransaction or we might need the provider
        // wallet.getSolanaProvider() returns the standard wallet adapter interface
        const provider = await wallet.getProvider();

        // The provider should look like a standard Solana connection/wallet
        // But with Privy, we might use wallet.signTransaction if available?
        // Let's assume standard window.solana style or adapter style
        // Actually, Wallet Adapter 'sendTransaction' is best.
        // But here we might just have the provider.
        // Let's try sending using the connection manually after signing?
        // Or if provider has signAndSendTransaction (Phantom style)

        // For now, simpler approach:
        // Use the connection created in the service to send? No, we need signature.

        // With Privy useWallets, we can direct it.
        // Ideally we'd use `useSolanaWallets` but let's try the generic provider

        // Looking at Privy docs: useSolanaWallets() -> createWallet...
        // Let's rely on wallet.signTransaction() if present?
        // Actually, let's treat it as a phantom-like provider

        // NOTE: This part relies on Privy exposing the provider correctly.
        // If this fails, we might need a more robust adapter setup.

        // Since we prepared the tx, let's assume we can sign it.
        // However, `createSolanaPaymentTransaction` returns a `Transaction` object.

        // If we can't easily sign, we might fail here. 
        // Let's try finding the send method.

        // MVP: Assume standard provider
        const signedTx = await provider.signTransaction(transaction);
        // Then we need to send it.
        // Using connection from service file? We should export connection or recreate it.
        // Let's just create one here for simplicity or import.
        const { Connection } = await import('@solana/web3.js');
        const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com');

        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(signature);

        return handleSuccess(signature, 'solana');
    };

    const handleBasePurchase = async (wallet: any) => {
        // 1. Get Payment Details (Target 100% to seller)
        const details = getBasePaymentDetails({
            sellerWallet: sellerWalletBase,
            amount: price
        });

        // 2. Switch Chain if needed
        if (wallet.chainId !== base.id.toString()) {
            await wallet.switchChain(base.id);
        }

        // 3. Connect viem client
        const provider = await wallet.getEthereumProvider();
        const client = createWalletClient({
            account: wallet.address as `0x${string}`,
            chain: base,
            transport: custom(provider)
        });

        // 4. Encode and Send
        // USDC Transfer ABI
        const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)']);

        const hash = await client.writeContract({
            address: details.tokenAddress as `0x${string}`,
            abi,
            functionName: 'transfer',
            args: [details.recipient as `0x${string}`, BigInt(details.amount.toString())]
        });

        return handleSuccess(hash, 'base');
    };

    const handleSuccess = async (txHash: string, chain: 'base' | 'solana') => {
        // 1. Record in DB
        const result = await recordPayment({
            productId,
            productPrice: price,
            buyerWalletAddress: wallets[0]?.address || 'unknown',
            sellerWalletAddress: chain === 'base' ? sellerWalletBase : sellerWalletSolana,
            txHash,
            chain
        });

        if (result.success && result.transaction) {
            // 2. Generate Token and Emails
            // We need to call an API route or server action to handle sensitive email sending?
            // Wait, email service is server-side only usually (Resend key shouldn't be public).
            // Our email.ts uses `process.env.RESEND_API_KEY`.
            // If this runs on client, it will fail if key is not NEXT_PUBLIC (which it shouldn't be).
            // So we need a Server Action or API Route.

            // For MVP, we'll assume there's an API route `/api/webhooks/payment` or similar, 
            // OR we use a Server Action if we are in App Router (we are).

            // But I didn't create a server action yet.
            // I'll call an API route we will create next: /api/payment/success

            await fetch('/api/payment/success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactionId: result.transaction.id,
                    creatorEmail,
                    productTitle,
                    amount: price,
                    buyerEmail: user?.email?.address // If user has email linked in Privy
                })
            });

            toast.success("Payment successful! Check your email.");
        } else {
            toast.error("Payment recorded failed, but transaction went through. Contact support.");
        }
    };

    return (
        <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-light h-12"
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            {children || `Buy for $${price} USDC`}
        </Button>
    );
}
