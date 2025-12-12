import { base } from 'viem/chains';

export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base-mainnet.infura.io/v3/c8bf17fa47c0443e8a392a70b0945ce0';

export const SUPPORTED_CHAINS = {
  base: {
    ...base,
    rpcUrls: {
      default: {
        http: [BASE_RPC_URL],
      },
      public: {
        http: [BASE_RPC_URL],
      },
    },
  },
};

export const USDC_ADDRESSES = {
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
};

export const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee
