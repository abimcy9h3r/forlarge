'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Wallet, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { authenticated, login, user } = usePrivy();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [chain, setChain] = useState<'base' | 'solana'>('base');

  useEffect(() => {
    fetchProduct();
  }, [params.productId]);

  async function fetchProduct() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!authenticated) {
      login();
      return;
    }

    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setProcessing(true);

    try {
      // Create transaction record
      const supabase = createClient();
      const txHash = `temp_${Date.now()}`; // Temporary hash, will be updated after payment

      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          product_id: product.id,
          buyer_wallet_address: user?.wallet?.address,
          seller_wallet_address: product.seller_wallet_address,
          amount: product.price,
          currency: 'USDC',
          chain: chain,
          tx_hash: txHash,
          status: 'pending',
          platform_fee: product.price * 0.05,
          creator_amount: product.price * 0.95
        })
        .select()
        .single();

      if (txError) throw txError;

      // Initialize Circle payment
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          currency: 'USDC',
          chain: chain,
          recipientAddress: product.seller_wallet_address,
          metadata: {
            productId: product.id,
            transactionId: transaction.id,
            buyerEmail: email
          }
        })
      });

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(paymentData.error || 'Payment failed');
      }

      // Redirect to payment confirmation or show payment UI
      router.push(`/checkout/confirm/${transaction.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>This product doesn't exist or is no longer available.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Product
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-light">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.cover_image_url && (
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-medium text-lg">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-light text-sky-500">${product.price} USDC</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-light">Payment Details</CardTitle>
              <CardDescription>Complete your purchase with crypto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!authenticated ? (
                <div className="text-center space-y-4 py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Connect your wallet to continue</p>
                  <Button onClick={login} className="w-full bg-sky-500 hover:bg-sky-600">
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send your download link to this email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Network</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={chain === 'base' ? 'default' : 'outline'}
                        onClick={() => setChain('base')}
                        className="h-auto py-4 flex flex-col gap-1"
                      >
                        <span className="font-medium">Base</span>
                        <span className="text-xs text-muted-foreground">EVM Chain</span>
                      </Button>
                      <Button
                        type="button"
                        variant={chain === 'solana' ? 'default' : 'outline'}
                        onClick={() => setChain('solana')}
                        className="h-auto py-4 flex flex-col gap-1"
                      >
                        <span className="font-medium">Solana</span>
                        <span className="text-xs text-muted-foreground">Fast & Low Fees</span>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-sky-500" />
                      <span className="text-sm font-medium">Connected Wallet</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={processing || !email}
                    className="w-full bg-sky-500 hover:bg-sky-600 h-12"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${product.price} USDC`
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to our terms of service
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
