# Domain Setup Guide - forlarge.app

## 🌐 Your Domain: `forlarge.app`

**Source:** Free domain from name.com via GitHub Student Developer Pack

---

## 📋 Step-by-Step Setup Guide

### Step 1: Claim Your Domain from name.com

1. **Access GitHub Student Developer Pack**
   - Go to https://education.github.com/pack
   - Verify your student status if not already done
   - Find the name.com offer (1 free .app domain)

2. **Claim Your Domain**
   - Click on the name.com offer
   - Sign up or log in to name.com
   - Search for `forlarge.app`
   - Apply your student discount code
   - Complete the registration (should be $0.00)

3. **Verify Domain Ownership**
   - Check your email for confirmation
   - Verify your account if required
   - Domain should appear in your name.com dashboard

---

### Step 2: Deploy to Vercel

1. **Push Code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   \`\`\`

2. **Import Project to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   - Add all required environment variables (see DEPLOYMENT.md)
   - Click "Deploy"
   - Wait for deployment to complete

4. **Get Vercel Deployment URL**
   - Note your deployment URL (e.g., `forlarge.vercel.app`)
   - This confirms your app is working

---

### Step 3: Configure DNS Records on name.com

1. **Login to name.com Dashboard**
   - Go to https://www.name.com/account/domain
   - Click on `forlarge.app`
   - Go to "DNS Records" section

2. **Add A Record (for root domain)**
   \`\`\`
   Type: A
   Host: @
   Answer: 76.76.21.21
   TTL: 300 (or Automatic)
   \`\`\`
   - Click "Add Record"

3. **Add CNAME Record (for www subdomain)**
   \`\`\`
   Type: CNAME
   Host: www
   Answer: cname.vercel-dns.com.
   TTL: 300 (or Automatic)
   \`\`\`
   - Click "Add Record"
   - **Important:** Include the trailing dot after `.com.`

4. **Save Changes**
   - DNS changes can take 1-48 hours to propagate (usually 1-2 hours)

---

### Step 4: Add Domain to Vercel

1. **Go to Vercel Project Settings**
   - Open your project in Vercel
   - Click "Settings" → "Domains"

2. **Add Root Domain**
   - Enter: `forlarge.app`
   - Click "Add"
   - Vercel will verify DNS automatically

3. **Add WWW Subdomain**
   - Enter: `www.forlarge.app`
   - Click "Add"
   - Set to redirect to `forlarge.app` (recommended)

4. **Wait for SSL Certificate**
   - Vercel automatically provisions SSL certificate
   - This takes 1-5 minutes
   - Status will change from "Pending" to "Valid"

---

### Step 5: Verify Everything Works

1. **Test Domain**
   - Visit https://forlarge.app
   - Verify site loads correctly
   - Check HTTPS is working (padlock icon)

2. **Test WWW Redirect**
   - Visit https://www.forlarge.app
   - Should redirect to https://forlarge.app

3. **Test Responsive Design**
   - Open on mobile device
   - Test on tablet
   - Verify all breakpoints work

---

## 🔒 SSL Certificate

**Automatic with Vercel:**
- ✅ SSL certificate is automatically provisioned
- ✅ HTTPS is enforced by default
- ✅ Certificate auto-renews every 90 days
- ✅ No manual configuration needed

---

## 📧 Email Configuration (Optional - For Transactional Emails)

### Setup Resend for Email Sending

1. **Login to Resend Dashboard**
   - Go to https://resend.com/domains
   - Sign up or log in

2. **Add Domain**
   - Click "Add Domain"
   - Enter: `forlarge.app`
   - Click "Add"

3. **Add DNS Records to name.com**

   **SPF Record:**
   \`\`\`
   Type: TXT
   Host: @
   Answer: v=spf1 include:_spf.resend.com ~all
   TTL: 300
   \`\`\`

   **DKIM Record:**
   \`\`\`
   Type: TXT
   Host: resend._domainkey
   Answer: [Copy from Resend dashboard]
   TTL: 300
   \`\`\`

   **DMARC Record:**
   \`\`\`
   Type: TXT
   Host: _dmarc
   Answer: v=DMARC1; p=none; rua=mailto:dmarc@forlarge.app
   TTL: 300
   \`\`\`

4. **Verify in Resend**
   - Click "Verify Domain"
   - Wait for DNS propagation (1-2 hours)
   - Status will change to "Verified"

5. **Update Environment Variable**
   - In Vercel, update: `FROM_EMAIL=noreply@forlarge.app`
   - Redeploy if needed

---

## 🎯 Subdomain Strategy (Future - Optional)

### If you want to use subdomains later:

**Dashboard Subdomain:**
\`\`\`
Type: CNAME
Host: dashboard
Answer: cname.vercel-dns.com.
TTL: 300
\`\`\`

**API Subdomain:**
\`\`\`
Type: CNAME
Host: api
Answer: cname.vercel-dns.com.
TTL: 300
\`\`\`

Then add these domains in Vercel:
- `dashboard.forlarge.app`
- `api.forlarge.app`

---

## 🔍 Troubleshooting

### Domain not working after 24 hours?
- Check DNS records are correct in name.com
- Verify A record points to `76.76.21.21`
- Verify CNAME points to `cname.vercel-dns.com.`
- Clear browser cache and try incognito mode

### SSL certificate not provisioning?
- Wait 5-10 minutes after adding domain
- Check DNS records are propagated: https://dnschecker.org
- Remove and re-add domain in Vercel

### Emails not sending?
- Verify domain in Resend dashboard
- Check all DNS records are added correctly
- Wait for DNS propagation (up to 48 hours)
- Test with Resend's testing tool

---

## ✅ Final Checklist

- [ ] Domain claimed from name.com
- [ ] Code deployed to Vercel
- [ ] A record added (76.76.21.21)
- [ ] CNAME record added (cname.vercel-dns.com.)
- [ ] Domain added in Vercel
- [ ] SSL certificate active
- [ ] Site loads at https://forlarge.app
- [ ] WWW redirect working
- [ ] Responsive design verified
- [ ] Email domain verified (optional)
- [ ] All environment variables set

---

**🎉 Congratulations! Your site is now live at https://forlarge.app**
```
Type: CNAME
Host: dashboard
Value: cname.vercel-dns.com
TTL: Automatic
```

**API Subdomain:**
```
Type: CNAME
Host: api
Value: cname.vercel-dns.com
TTL: Automatic
```

---

## ✅ Verification Checklist

### After DNS Configuration:

- [ ] Visit `forlarge.app` - should load your site
- [ ] Visit `www.forlarge.app` - should redirect to main domain
- [ ] Check HTTPS is working (green padlock)
- [ ] Test email sending from `noreply@forlarge.app`
- [ ] Verify all pages load correctly
- [ ] Test on mobile devices
- [ ] Check SSL certificate validity

---

## 🔍 DNS Propagation Check

Use these tools to verify DNS changes:
- https://dnschecker.org
- https://www.whatsmydns.net

**Note:** DNS changes can take 1-48 hours to propagate globally.

---

## 🚀 Deployment Steps

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Add Domain in Vercel

1. Go to project settings
2. Click "Domains"
3. Add `forlarge.app`
4. Follow verification steps

### 3. Configure Environment Variables

Add all required environment variables in Vercel dashboard:
- Go to Settings → Environment Variables
- Add all variables from UPDATES.md
- Redeploy after adding variables

---

## 📱 Mobile Optimization

### Already Implemented:
- ✅ Responsive breakpoints (sm, md, lg, xl)
- ✅ Touch-friendly button sizes (min 44px)
- ✅ Readable font sizes on mobile
- ✅ No horizontal scrolling
- ✅ Optimized images
- ✅ Fast loading times

---

## 🎨 Brand Colors

### Primary Colors:
- **Sky Blue:** `#0ea5e9` (rgb(14, 165, 233))
- **Black:** `#000000` (dark mode background)
- **White:** `#FFFFFF` (light mode background)

### Usage:
- Primary actions: Sky blue
- Text: Black/White (based on theme)
- Accents: Sky blue
- Focus rings: Sky blue

---

## 🔐 Security Headers

### Add to Vercel (vercel.json):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📊 Analytics Setup (Optional)

### Vercel Analytics:
```bash
npm install @vercel/analytics
```

Add to `src/app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🎉 Go Live Checklist

- [ ] Domain configured in name.com
- [ ] DNS records added
- [ ] Deployed to Vercel
- [ ] Domain added in Vercel
- [ ] SSL certificate active
- [ ] Email domain verified
- [ ] All environment variables set
- [ ] Test purchase flow
- [ ] Test email notifications
- [ ] Test on multiple devices
- [ ] Monitor error logs
- [ ] Set up analytics

---

**Last Updated:** January 12, 2025
**Domain:** forlarge.app (name.com)
**Hosting:** Vercel (Recommended)
