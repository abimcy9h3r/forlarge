# 📋 Forlarge - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** January 2025  
**Project:** Web3 Creator Commerce Platform

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Architecture Overview](#architecture-overview)
4. [Database Schema](#database-schema)
5. [Key Features & Implementation](#key-features--implementation)
6. [File Structure Guide](#file-structure-guide)
7. [Development Workflow](#development-workflow)
8. [Testing Guide](#testing-guide)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What We're Building

Forlarge is a Web3 creator commerce platform that allows digital creators (starting with music producers) to sell their products with:
- **95% revenue share** (5% platform fee)
- **Instant crypto payments** (USDC on Base and Solana)
- **Hybrid file uploads** (direct or external links)
- **Secure download system** with token-based access

### Target Users

1. **Creators** - Music producers, sound designers, digital artists
2. **Buyers** - Musicians, producers, content creators looking for digital assets

### Core Value Proposition

- **For Creators:** Keep 95% of revenue, get paid instantly in crypto, no chargebacks
- **For Buyers:** Instant access, secure transactions, global payment options

---

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have:

```bash
- Node.js 18+ installed
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)
- Supabase account (free tier works)
- Privy account (for wallet auth)
- Circle account (for payments)
```

### Initial Setup

#### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd forlarge

# Install dependencies
npm install
```

#### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Privy (Wallet Authentication)
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Circle (Payment Processing)
CIRCLE_API_KEY=your-circle-api-key
CIRCLE_ENTITY_SECRET=your-circle-entity-secret
CIRCLE_WALLET_ID=your-circle-wallet-id

# Resend (Email Notifications)
RESEND_API_KEY=your-resend-api-key

# Blockchain RPC
NEXT_PUBLIC_INFURA_API_KEY=your-infura-api-key
```

#### 3. Database Setup

**Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and keys

**Step 2: Run Migrations**

Run migrations in order from the Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard → SQL Editor
# Run each migration file in order:

1. supabase/migrations/20240101000000_initial_schema.sql
2. supabase/migrations/20240102000000_auth_and_dashboard_schema.sql
3. supabase/migrations/20240103000000_auth_schema.sql
4. supabase/migrations/20240104000000_simple_schema.sql
5. supabase/migrations/20240105000000_rls_policies.sql
6. supabase/migrations/20240106000000_add_indexes.sql
7. supabase/migrations/20240107000000_add_wallet_fields.sql
8. supabase/migrations/20240108000000_hybrid_upload_and_payments.sql
```

**Step 3: Enable Storage**
1. Go to Storage in Supabase Dashboard
2. Create a bucket named `products`
3. Set bucket to public for file access

#### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

---

## 🏗️ Architecture Overview

### Tech Stack Breakdown

#### Frontend Layer
- **Next.js 14 (App Router)** - Server-side rendering, routing, API routes
- **React 18** - UI components and state management
- **TypeScript** - Type safety across the codebase
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built accessible components

#### Backend Layer
- **Supabase** - PostgreSQL database, authentication, storage
- **Next.js API Routes** - Server-side logic and API endpoints
- **Row Level Security (RLS)** - Database-level security

#### Web3 Layer
- **Privy** - Wallet authentication and connection
- **Circle SDK** - USDC payment processing
- **wagmi + viem** - Ethereum blockchain interaction
- **@solana/web3.js** - Solana blockchain interaction

#### Services Layer
- **Resend** - Transactional emails
- **Infura** - Blockchain RPC provider

### Data Flow

```
User Action → Next.js Page → API Route → Supabase Database
                                ↓
                          Circle Payment API
                                ↓
                          Blockchain Transaction
                                ↓
                          Email Notification
```

---

## 🗄️ Database Schema

### Core Tables

#### 1. `products` Table

Stores all digital products uploaded by creators.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  slug TEXT UNIQUE NOT NULL,
  file_url TEXT,
  file_type TEXT DEFAULT 'direct', -- 'direct' or 'external'
  external_file_url TEXT,
  preview_file_url TEXT,
  file_size_mb DECIMAL(10, 2),
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `file_type`: Determines if file is stored in Supabase or external link
- `slug`: URL-friendly unique identifier for product pages
- `is_active`: Controls product visibility in marketplace

#### 2. `transactions` Table

Tracks all payment transactions.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  buyer_wallet_address TEXT NOT NULL,
  seller_wallet_address TEXT NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  currency TEXT NOT NULL, -- 'USDC'
  chain TEXT NOT NULL, -- 'base' or 'solana'
  tx_hash TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  platform_fee DECIMAL(18, 6),
  creator_amount DECIMAL(18, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);
```

**Key Fields:**
- `tx_hash`: Blockchain transaction hash for verification
- `platform_fee`: 5% of total amount
- `creator_amount`: 95% of total amount

#### 3. `download_access` Table

Manages secure download access after purchase.

```sql
CREATE TABLE download_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  buyer_wallet_address TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `access_token`: Unique token for secure download access
- `expires_at`: Download link expiry (default 24 hours)
- `max_downloads`: Limit downloads per purchase (default 5)

### Indexes

Performance-critical indexes:

```sql
-- Products
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Transactions
CREATE INDEX idx_transactions_buyer ON transactions(buyer_wallet_address);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);

-- Download Access
CREATE INDEX idx_download_access_token ON download_access(access_token);
CREATE INDEX idx_download_access_buyer ON download_access(buyer_wallet_address);
```

---

## 🎯 Key Features & Implementation

### 1. Product Upload System

**Location:** `src/app/dashboard/products/new/page.tsx`

**How It Works:**

1. **Hybrid Upload Options**
   - **Direct Upload:** Files up to 200MB stored in Supabase Storage
   - **External Link:** Support for Mega.nz, Google Drive, Dropbox, OneDrive

2. **File Validation**
   - Location: `src/lib/utils/file-validation.ts`
   - Validates file size, type, and external URLs
   - Formats file sizes for display

3. **Slug Generation**
   - Location: `src/lib/utils/slug.ts`
   - Converts product title to URL-friendly slug
   - Ensures uniqueness by checking database

**Implementation Example:**

```typescript
// File validation
import { validateFileSize, validateExternalUrl } from '@/lib/utils/file-validation';

const file = e.target.files?.[0];
if (file) {
  const sizeInMB = file.size / (1024 * 1024);
  if (!validateFileSize(sizeInMB, 200)) {
    setError('File too large. Use external link option.');
    return;
  }
}

// Slug generation
import { generateSlug } from '@/lib/utils/slug';

const slug = await generateSlug(productTitle, supabase);
```

### 2. Payment Processing

**Location:** `src/lib/services/circle.ts` and `src/lib/services/payment.ts`

**Payment Flow:**

1. **Initialize Payment**
   ```typescript
   import { createPayment } from '@/lib/services/circle';
   
   const payment = await createPayment({
     amount: productPrice,
     currency: 'USDC',
     chain: 'base', // or 'solana'
     recipientAddress: creatorWallet
   });
   ```

2. **Record Transaction**
   ```typescript
   import { recordPayment } from '@/lib/services/payment';
   
   await recordPayment({
     productId,
     buyerWallet,
     sellerWallet,
     amount,
     txHash,
     chain
   });
   ```

3. **Fee Distribution**
   - Platform fee: 5% of total
   - Creator amount: 95% of total
   - Calculated automatically in `payment.ts`

### 3. Download Access System

**Location:** `src/lib/services/download.ts`

**How It Works:**

1. **Generate Access Token**
   ```typescript
   import { generateDownloadToken } from '@/lib/utils/download-token';
   import { createDownloadAccess } from '@/lib/services/download';
   
   const token = generateDownloadToken();
   await createDownloadAccess({
     transactionId,
     productId,
     buyerWallet,
     token,
     expiresIn: 24 * 60 * 60 * 1000 // 24 hours
   });
   ```

2. **Validate Access**
   ```typescript
   import { validateDownloadAccess } from '@/lib/services/download';
   
   const isValid = await validateDownloadAccess(token);
   if (!isValid) {
     return { error: 'Invalid or expired token' };
   }
   ```

3. **Track Downloads**
   - Increments download count on each access
   - Enforces max download limit (default 5)
   - Checks expiry time

### 4. Wallet Authentication

**Location:** `src/components/providers/PrivyProvider.tsx`

**Setup:**

```typescript
import { PrivyProvider } from '@/components/providers/PrivyProvider';

// In your root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PrivyProvider>
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
```

**Usage in Components:**

```typescript
import { usePrivy } from '@privy-io/react-auth';

function Component() {
  const { login, logout, authenticated, user } = usePrivy();
  
  return (
    <button onClick={authenticated ? logout : login}>
      {authenticated ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}
```

### 5. Theme System

**Location:** `src/components/theme-provider.tsx` and `src/components/theme-toggle.tsx`

**Implementation:**

```typescript
// Theme Provider (already set up in layout)
import { ThemeProvider } from '@/components/theme-provider';

// Theme Toggle Component
import { ThemeToggle } from '@/components/theme-toggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

**Color System:**
- Primary: Sky Blue `#0ea5e9`
- Dark mode: Black background `#000000`
- Light mode: White background `#FFFFFF`

---

## 📂 File Structure Guide

### Key Directories

#### `/src/app` - Next.js App Router Pages

```
app/
├── dashboard/          # Protected creator dashboard
│   ├── products/       # Product management
│   ├── analytics/      # Analytics page
│   ├── sales/          # Sales history
│   └── settings/       # Account settings
├── products/[id]/      # Public product pages
├── explore/            # Browse marketplace
├── login/              # Login page
├── signup/             # Signup page
└── page.tsx            # Landing page
```

#### `/src/components` - React Components

```
components/
├── ui/                 # shadcn/ui components
├── providers/          # Context providers
│   └── PrivyProvider.tsx
├── theme-provider.tsx
└── theme-toggle.tsx
```

#### `/src/lib` - Utility Libraries

```
lib/
├── config/
│   └── chains.ts       # Blockchain configuration
├── services/
│   ├── circle.ts       # Circle payment API
│   ├── payment.ts      # Payment processing
│   └── download.ts     # Download management
├── supabase/
│   ├── client.ts       # Browser client
│   ├── server.ts       # Server client
│   ├── middleware.ts   # Auth middleware
│   └── queries.ts      # Database queries
└── utils/
    ├── slug.ts         # Slug generation
    ├── file-validation.ts
    └── download-token.ts
```

### Important Files

#### `middleware.ts` - Route Protection

Handles authentication and route protection:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}
```

#### `tailwind.config.ts` - Styling Configuration

Custom theme configuration:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(199, 89%, 48%)', // Sky blue
        // ... other colors
      }
    }
  }
}
```

---

## 🔄 Development Workflow

### Adding a New Feature

#### Step 1: Plan the Feature

1. Identify required database changes
2. Determine API endpoints needed
3. Plan UI components

#### Step 2: Database Changes

If database changes are needed:

```sql
-- Create new migration file
-- supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql

ALTER TABLE products ADD COLUMN new_field TEXT;
CREATE INDEX idx_products_new_field ON products(new_field);
```

Run migration in Supabase SQL Editor.

#### Step 3: Create Service Functions

Add business logic in `/src/lib/services/`:

```typescript
// src/lib/services/my-feature.ts

import { createClient } from '@/lib/supabase/server';

export async function myFeatureFunction(params: any) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('field', params.value);
    
  if (error) throw error;
  return data;
}
```

#### Step 4: Create UI Components

Add components in `/src/components/`:

```typescript
// src/components/MyFeature.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MyFeature() {
  const [state, setState] = useState();
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

#### Step 5: Create Page/Route

Add page in `/src/app/`:

```typescript
// src/app/my-feature/page.tsx

import { MyFeature } from '@/components/MyFeature';

export default function MyFeaturePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Feature</h1>
      <MyFeature />
    </div>
  );
}
```

### Code Style Guidelines

#### TypeScript

```typescript
// Use explicit types
interface Product {
  id: string;
  title: string;
  price: number;
}

// Use async/await
async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}

// Handle errors properly
try {
  const product = await fetchProduct(id);
} catch (error) {
  console.error('Failed to fetch product:', error);
}
```

#### React Components

```typescript
// Use functional components
export function ProductCard({ product }: { product: Product }) {
  return <div>{product.title}</div>;
}

// Use hooks for state
const [loading, setLoading] = useState(false);

// Use useEffect for side effects
useEffect(() => {
  fetchData();
}, [dependency]);
```

#### Styling

```typescript
// Use Tailwind classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-black">
  <h2 className="text-xl font-bold text-primary">Title</h2>
</div>

// Responsive design
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Product Upload Flow

- [ ] Direct file upload (< 200MB)
- [ ] External link upload (Mega.nz, Google Drive)
- [ ] File size validation
- [ ] Cover image upload
- [ ] Slug generation and uniqueness
- [ ] Product appears in dashboard
- [ ] Product visible in marketplace

#### Payment Flow

- [ ] Connect wallet (Base)
- [ ] Connect wallet (Solana)
- [ ] Initiate payment
- [ ] Payment confirmation
- [ ] Transaction recorded in database
- [ ] Fee distribution (5% platform, 95% creator)
- [ ] Email notification sent

#### Download Flow

- [ ] Generate download token
- [ ] Access download page
- [ ] Download file
- [ ] Token expiry (24 hours)
- [ ] Download count limit (5 downloads)
- [ ] Invalid token handling

#### Authentication

- [ ] Sign up with email
- [ ] Sign in with wallet
- [ ] Protected route access
- [ ] Logout functionality
- [ ] Session persistence

### Testing Payment Flow (Test Mode)

Use Circle test API key for testing:

```env
CIRCLE_API_KEY=TEST_API_KEY:53f3700ad71c935dbe30c835ceea9f15:97790d51a91d7ae41954771e3b3696bd
```

Test wallets:
- **Base Testnet:** Use Sepolia testnet USDC
- **Solana Devnet:** Use devnet USDC

---

## 🚀 Deployment Guide

### Deploying to Vercel

#### Step 1: Prepare for Deployment

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your Git repository
4. Configure project settings

#### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
CIRCLE_API_KEY=
CIRCLE_ENTITY_SECRET=
CIRCLE_WALLET_ID=
RESEND_API_KEY=
NEXT_PUBLIC_INFURA_API_KEY=
```

#### Step 4: Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

Or push to main branch for automatic deployment.

### Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Storage bucket configured
- [ ] Domain configured (see DOMAIN_SETUP.md)
- [ ] SSL certificate active
- [ ] Test payment flow in production
- [ ] Test email notifications
- [ ] Monitor error logs

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:** `Failed to connect to Supabase`

**Solution:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active

#### 2. File Upload Fails

**Error:** `Failed to upload file`

**Solution:**
- Check Supabase Storage bucket exists
- Verify bucket is set to public
- Check file size is under 200MB
- Ensure `SUPABASE_SERVICE_KEY` is set

#### 3. Payment Not Processing

**Error:** `Payment failed`

**Solution:**
- Verify Circle API credentials
- Check wallet has sufficient USDC
- Ensure correct chain is selected
- Check Circle API status

#### 4. Download Link Expired

**Error:** `Download link expired`

**Solution:**
- Generate new download token
- Check `expires_at` timestamp
- Verify download count hasn't exceeded limit

#### 5. Wallet Connection Issues

**Error:** `Failed to connect wallet`

**Solution:**
- Check `NEXT_PUBLIC_PRIVY_APP_ID` is set
- Verify Privy app is configured correctly
- Ensure wallet extension is installed
- Try different wallet provider

### Debug Mode

Enable debug logging:

```typescript
// Add to any file for debugging
console.log('Debug:', { variable, state, data });

// For Supabase queries
const { data, error } = await supabase
  .from('products')
  .select('*');
  
console.log('Supabase response:', { data, error });
```

### Getting Help

1. Check [UPDATES.md](./UPDATES.md) for recent changes
2. Review [README.md](./README.md) for overview
3. Check Supabase logs in dashboard
4. Review Vercel deployment logs
5. Contact development team

---

## 📝 Additional Resources

### External Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Privy Docs](https://docs.privy.io)
- [Circle Docs](https://developers.circle.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Project Documentation

- [README.md](./README.md) - Project overview
- [UPDATES.md](./UPDATES.md) - Development updates
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) - Domain configuration

---

## 🎓 Onboarding Checklist for New Team Members

- [ ] Read this PRD completely
- [ ] Set up local development environment
- [ ] Run the app locally
- [ ] Create a test product
- [ ] Test payment flow (test mode)
- [ ] Review codebase structure
- [ ] Understand database schema
- [ ] Review key service files
- [ ] Test deployment process
- [ ] Join team communication channels

---

**Last Updated:** January 2025  
**Maintained By:** Forlarge Development Team  
**Questions?** Contact the team lead
