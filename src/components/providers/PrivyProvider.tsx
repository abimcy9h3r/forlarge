"use client";

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { SUPPORTED_CHAINS } from '@/lib/config/chains';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  // Check if Privy is configured at runtime
  if (typeof window !== 'undefined') {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    
    if (!appId || appId === '' || appId === 'undefined') {
      console.warn('Privy is not configured. Wallet features will be disabled.');
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
        }}
      >
        {children}
      </Privy>
    );
  }
  
  // Server-side render without Privy
  return <>{children}</>;
}
