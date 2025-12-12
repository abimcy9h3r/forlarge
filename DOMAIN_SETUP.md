# Domain Setup Guide - forlarge.app

## 🌐 Domain Configuration

### Your Domain: `forlarge.app` (from name.com)

---

## 📋 DNS Configuration

### For Vercel Deployment (Recommended)

1. **Login to name.com**
   - Go to your domain dashboard
   - Select `forlarge.app`

2. **Add DNS Records**

   **A Record:**
   ```
   Type: A
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

   **CNAME Record:**
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

3. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Domains"
   - Add `forlarge.app`
   - Add `www.forlarge.app`
   - Vercel will verify DNS automatically

---

## 🔒 SSL Certificate

**Automatic with Vercel:**
- SSL certificate is automatically provisioned
- HTTPS is enforced by default
- Certificate auto-renews

---

## 📧 Email Configuration (Resend)

### Verify Domain for Email Sending

1. **Login to Resend Dashboard**
   - Go to https://resend.com/domains

2. **Add Domain**
   - Click "Add Domain"
   - Enter: `forlarge.app`

3. **Add DNS Records to name.com**

   **SPF Record:**
   ```
   Type: TXT
   Host: @
   Value: v=spf1 include:_spf.resend.com ~all
   TTL: Automatic
   ```

   **DKIM Record:**
   ```
   Type: TXT
   Host: resend._domainkey
   Value: [Provided by Resend]
   TTL: Automatic
   ```

   **DMARC Record:**
   ```
   Type: TXT
   Host: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@forlarge.app
   TTL: Automatic
   ```

4. **Verify in Resend**
   - Click "Verify Domain"
   - Wait for DNS propagation (up to 48 hours, usually 1-2 hours)

---

## 🎯 Subdomain Strategy (Optional - Future)

### If you want to use subdomains later:

**Dashboard Subdomain:**
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
