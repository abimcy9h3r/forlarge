"use client";

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { SUPPORTED_CHAINS } from '@/lib/config/chains';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Disable Privy if not configured or in canvas environment
  if (!appId || appId === '' || appId === 'undefined' ||
    (typeof window !== 'undefined' && (
      window.location.hostname.includes('canvases.tempo.build') ||
      window.location.hostname.includes('tempo.build')
    ))) {
    return <>{children}</>;
  }

  return (
    <Privy
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#0ea5e9',
        },
        loginMethods: ['email', 'wallet', 'google'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        supportedChains: [SUPPORTED_CHAINS.base],
        solanaClusters: [{ name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' }],
      }}
    >
      {children}
    </Privy>
  );
}
