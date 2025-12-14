# 🎵 Forlarge - Web3 Creator Commerce Platform

> **Keep 95% of your revenue. Get paid instantly. Sell globally with crypto payments.**

Forlarge is a modern Web3 creator commerce platform built for digital creators (starting with music producers) to sell their digital products with minimal fees and instant crypto payments.

**Live at:** [forlarge.app](https://forlarge.app)

---

## 🌟 Key Features

### For Creators
- **95% Revenue Share** - Keep almost all your earnings (5% platform fee)
- **Instant Payments** - Get paid immediately in USDC stablecoin
- **Global Reach** - Accept payments from anywhere in the world
- **Hybrid File Uploads** - Direct uploads (up to 200MB) or external links (Mega.nz, Google Drive, etc.)
- **Secure Downloads** - Token-based download system with expiry and limits
- **Product Management** - Full dashboard to upload, edit, and track products
- **Analytics** - Track views, sales, and revenue in real-time
- **Dark/Light Mode** - Seamless theme switching with system preference detection

### For Buyers
- **Crypto Payments** - Pay with USDC on Base (EVM) or Solana
- **Instant Access** - Download immediately after payment confirmation
- **Wallet Integration** - Connect with Privy (supports 100+ wallets)
- **Preview Before Purchase** - Listen to audio previews before buying
- **Secure Transactions** - All payments verified on-chain
- **Responsive Design** - Optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom theme
- **shadcn/ui** - Beautiful, accessible UI components
- **next-themes** - Dark/light mode with system preference detection
- **Inter Font** - Clean, modern typography

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Storage** - File storage for direct uploads
- **Row Level Security (RLS)** - Database-level security policies

### Web3 & Payments
- **Privy** - Wallet authentication (supports Base, Solana, and 100+ wallets)
- **Circle SDK** - USDC payment processing
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **@solana/web3.js** - Solana blockchain integration
- **@solana/pay** - Solana payment protocol

### Additional Services
- **Resend** - Transactional email notifications
- **QRCode** - Generate payment QR codes
- **nanoid** - Secure token generation

---

## 📦 Installation & Setup

See **[PRD.md](./PRD.md)** for detailed setup instructions.

Quick start:

\`\`\`bash
# Clone repository
git clone <repository-url>
cd forlarge

# Install dependencies
npm install

# Set up environment variables
# See PRD.md for required environment variables

# Run database migrations
# See PRD.md for Supabase setup

# Start development server
npm run dev
\`\`\`

---

## 🚀 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for production deployment guide.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Configure domain (see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md))

---

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Complete product requirements and setup guide
- **[UPDATES.md](./UPDATES.md)** - Development progress and latest updates
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)** - Domain configuration for forlarge.app

---

## 🎨 Design System

- **Colors:** Black (#000000), White (#FFFFFF), Sky Blue (#0ea5e9)
- **Typography:** Inter font family
- **Responsive:** Mobile-first (375px minimum width)
- **Animations:** 150ms ease-in-out transitions
- **Accessibility:** High contrast with sky-blue focus rings

---

**Built with ❤️ for creators by creators**
