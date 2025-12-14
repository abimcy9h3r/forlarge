# Forlarge Platform - Production Deployment Guide

## 🌐 Domain Strategy

### Primary Domains
- **Main App:** `forlarge.app`
- **Dashboard:** `dashboard.forlarge.app`
- **API:** `api.forlarge.app` (optional, for future scaling)

### Alternative Approach (Recommended for MVP)
- **Main App:** `forlarge.app` (landing + auth)
- **Dashboard:** `forlarge.app/dashboard` (authenticated routes)

**Why this is better for MVP:**
- ✅ Simpler SSL/DNS setup
- ✅ Easier authentication flow
- ✅ Lower infrastructure costs
- ✅ Faster deployment
- ✅ Can migrate to subdomain later

---

## 🔐 Environment Variables Required

### Supabase (Already Set)
```env
SUPABASE_PROJECT_ID=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Privy (Wallet Authentication)
```env
NEXT_PUBLIC_PRIVY_APP_ID=cmj1snymi0140jo0c5w7xnclw
PRIVY_APP_SECRET=privy_app_secret_29FDGSeZhf7jzJZtVJidiDwn5A4GN19xDemicDAvi79JqGWjsKxKBXpygqQNyryV7ML3ApdFynxH61k8CdH3JVuU
```

### Base Network (Infura)
```env
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.infura.io/v3/c8bf17fa47c0443e8a392a70b0945ce0
NEXT_PUBLIC_BASE_API_KEY=c8bf17fa47c0443e8a392a70b0945ce0
```

### Circle (USDC Payments)
```env
CIRCLE_API_KEY=<get_from_circle_dashboard>
CIRCLE_ENTITY_SECRET=<get_from_circle_dashboard>
CIRCLE_WALLET_ID=<get_from_circle_dashboard>
```

### Resend (Email Notifications)
```env
RESEND_API_KEY=re_3zqaUqp6_92g5TqynaoG22MauPxTumhX5
FROM_EMAIL=noreply@forlarge.app
```

### Helius (Solana RPC)
```env
NEXT_PUBLIC_HELIUS_API_KEY=b26ce471-d141-40cb-a4d1-eefcca0bfca4
```

### Platform Configuration
```env
NEXT_PUBLIC_APP_URL=https://forlarge.app
PLATFORM_WALLET_BASE=<your_base_wallet_address>
PLATFORM_WALLET_SOLANA=<your_solana_wallet_address>
```

---

## 📋 Pre-Deployment Checklist

### 1. Circle Setup (CRITICAL)
- [ ] Sign up at https://console.circle.com
- [ ] Complete KYC verification
- [ ] Create a wallet
- [ ] Get API credentials
- [ ] Test in sandbox mode first
- [ ] Switch to production

### 2. Domain Setup
- [ ] Purchase `forlarge.app` domain
- [ ] Configure DNS records
- [ ] Set up SSL certificates
- [ ] Configure CORS for API

### 3. Privy Configuration
- [ ] Update allowed domains in Privy dashboard
- [ ] Add `forlarge.app` to allowed origins
- [ ] Add `dashboard.forlarge.app` if using subdomain
- [ ] Test wallet connection

### 4. Supabase Configuration
- [ ] Update allowed domains in Supabase dashboard
- [ ] Configure email templates
- [ ] Set up storage buckets
- [ ] Enable RLS policies
- [ ] Test database connections

### 5. Email Setup (Resend)
- [ ] Verify domain in Resend
- [ ] Add DNS records for email
- [ ] Create email templates
- [ ] Test email delivery

---

## 🚀 Deployment Platforms (Recommended)

### Option 1: Vercel (Recommended) ⭐

**Best for:** Next.js apps, fastest deployment, production-ready

**Pros:**
- ✅ Zero-config Next.js deployment
- ✅ Automatic SSL certificates
- ✅ Edge functions support
- ✅ Built-in analytics
- ✅ Preview deployments for PRs
- ✅ Free tier available (hobby projects)
- ✅ Excellent performance with CDN
- ✅ Easy custom domain setup

**Quick Deploy Steps:**

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   \`\`\`

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - Add all variables from the list above
   - Click "Deploy"

4. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `forlarge.app`
   - Follow DNS instructions (see DOMAIN_SETUP.md)
   - SSL auto-configured

**CLI Deployment (Alternative):**
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Add environment variables via dashboard or CLI
vercel env add SUPABASE_URL
\`\`\`

**Post-Deployment:**
- ✅ Verify site loads at your-project.vercel.app
- ✅ Add custom domain (forlarge.app)
- ✅ Test all features
- ✅ Monitor analytics

---

### Option 2: Netlify
**Best for:** Static sites with serverless functions

**Pros:**
- ✅ Easy deployment
- ✅ Good free tier
- ✅ Built-in forms
- ✅ Split testing

**Setup:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

### Option 3: Railway
**Best for:** Full-stack apps with databases

**Pros:**
- ✅ Simple pricing
- ✅ Built-in databases
- ✅ Good for monoliths
- ✅ Easy scaling

---

## 🏗️ Production Architecture

\`\`\`
┌─────────────────────────────────────────┐
│         forlarge.app (Main App)         │
│  - Landing page                         │
│  - Authentication (Privy)               │
│  - Public product pages                 │
│  - Responsive design (mobile-first)     │
│  - Dark/light theme toggle              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│    forlarge.app/dashboard (Protected)   │
│  - Creator dashboard                    │
│  - Product management                   │
│  - Analytics & insights                 │
│  - Sales tracking                       │
│  - File upload (direct + external)      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Supabase (Backend)              │
│  - PostgreSQL database                  │
│  - File storage (up to 200MB)           │
│  - Row Level Security (RLS)             │
│  - Real-time subscriptions              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Payment Infrastructure             │
│  - Circle (USDC payments)               │
│  - Base Network (via Infura)            │
│  - Privy (Wallet connection)            │
│  - Solana support (via Helius)          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Additional Services                │
│  - Resend (Email notifications)         │
│  - QR Code generation                   │
│  - Download token system                │
└─────────────────────────────────────────┘
\`\`\`

---

## 🔒 Security Checklist

### Environment Variables
- [ ] Never commit `.env` files
- [ ] Use platform-specific env var management
- [ ] Rotate API keys regularly
- [ ] Use different keys for dev/prod

### API Security
- [ ] Enable CORS properly
- [ ] Rate limit API endpoints
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Implement CSRF protection

### Database Security
- [ ] Enable RLS on all tables
- [ ] Use service role key only in server
- [ ] Validate user permissions
- [ ] Encrypt sensitive data
- [ ] Regular backups

### Payment Security
- [ ] Verify transaction signatures
- [ ] Validate payment amounts
- [ ] Check wallet addresses
- [ ] Log all transactions
- [ ] Monitor for fraud

---

## 📊 Monitoring & Analytics

### Essential Tools
1. **Vercel Analytics** (if using Vercel)
   - Page views
   - Performance metrics
   - User behavior

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

3. **PostHog** (Product Analytics)
   ```bash
   npm install posthog-js
   ```

4. **Supabase Dashboard**
   - Database queries
   - Storage usage
   - API calls

---

## 🚦 Launch Checklist

### Pre-Launch (Complete)
- [x] Responsive design verified (mobile, tablet, desktop)
- [x] Dark/light theme working
- [x] Database schema finalized
- [x] RLS policies implemented
- [x] Download token system ready
- [x] Privy integration configured
- [x] File upload system (direct + external)
- [x] Payment infrastructure ready

### Week Before Launch
- [ ] Complete Circle API setup and KYC
- [ ] Test payment flow end-to-end
- [ ] Test email notifications
- [ ] Test file uploads/downloads on all devices
- [ ] Load test with 100+ concurrent users
- [ ] Security audit
- [ ] Backup database
- [ ] Set up monitoring (Sentry/PostHog)

### Launch Day
- [ ] Deploy to Vercel production
- [ ] Verify all environment variables
- [ ] Add custom domain (forlarge.app)
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check payment processing
- [ ] Verify email delivery
- [ ] Test on multiple devices and browsers
- [ ] Verify SSL certificate active

### Post-Launch (First Week)
- [ ] Monitor error rates daily
- [ ] Track user signups
- [ ] Monitor payment success rate
- [ ] Collect user feedback
- [ ] Fix critical bugs immediately
- [ ] Optimize performance based on metrics
- [ ] Update documentation

---

## 🎯 MVP Feature Status

### ✅ Completed (Ready for Launch)
1. ✅ User authentication (Privy wallet integration)
2. ✅ Product creation with hybrid file upload (direct + external links)
3. ✅ Product pages with audio preview
4. ✅ USDC payment infrastructure (Circle SDK)
5. ✅ Download access system with tokens
6. ✅ Email notification system (Resend)
7. ✅ Responsive design (mobile-first)
8. ✅ Dark/light theme toggle
9. ✅ Database with RLS policies
10. ✅ Creator dashboard UI

### 🚧 In Progress (Week 1-2)
1. Creator dashboard analytics
2. Sales history tracking
3. Product search functionality
4. Share functionality
5. QR code generation for payments

### 📋 Planned (Week 3+)
1. Social media integration
2. Advanced analytics dashboard
3. Bulk operations
4. API for third-party integrations
5. Mobile app (React Native)

---

## 💰 Cost Estimation (Monthly)

### Infrastructure
- **Vercel Pro:** $20/month (recommended for production)
- **Supabase Pro:** $25/month (includes 8GB database)
- **Circle:** 0.5-1% per transaction
- **Resend:** $20/month (50k emails)
- **Domain:** $12/year

**Total:** ~$70-80/month + transaction fees

### Scaling Costs
- **100 users:** ~$100/month
- **1,000 users:** ~$200/month
- **10,000 users:** ~$500/month

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📞 Support & Maintenance

### Daily Tasks
- Monitor error logs
- Check payment processing
- Review user feedback

### Weekly Tasks
- Database backups
- Performance optimization
- Security updates
- Feature releases

### Monthly Tasks
- Cost analysis
- User analytics review
- Infrastructure scaling
- Security audit

---

## 🎉 Ready for Production?

### Final Verification
```bash
# Test build locally
npm run build
npm run start

# Check environment variables
npm run env:check

# Run tests
npm run test

# Security audit
npm audit

# Deploy
vercel --prod
```

---

**Last Updated:** January 12, 2025
**Status:** Ready for deployment after Circle setup
