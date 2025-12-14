'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ConnectWalletButton() {
  const { login, logout, authenticated, user } = usePrivy();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <Button
        onClick={login}
        variant="outline"
        size="sm"
        className="rounded-full h-7 px-3 text-xs font-light gap-1.5"
      >
        <Wallet className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Connect</span>
      </Button>
    );
  }

  const walletAddress = user?.wallet?.address;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-7 px-3 text-xs font-light gap-1.5"
        >
          <Wallet className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {walletAddress ? formatAddress(walletAddress) : 'Connected'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-light">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
            {walletAddress && (
              <p className="text-xs font-mono">{formatAddress(walletAddress)}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (walletAddress) {
              navigator.clipboard.writeText(walletAddress);
            }
          }}
          className="cursor-pointer font-light text-xs"
        >
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer font-light text-xs text-red-500 focus:text-red-500"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
