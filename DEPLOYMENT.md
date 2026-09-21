# BT Vizion Deployment Guide

## Quick Start with Vercel (Recommended)

### Prerequisites
- Node.js 18+ (for local testing)
- Bun or npm (for dependency installation)
- Vercel account (free)
- btvizion.co.za domain access

### Step 1: Install Dependencies
```bash
# Using npm
npm install

# OR using bun (faster)
bun install
```

### Step 2: Test Locally
```bash
# Start development server
npm run dev
# or
bun run dev

# Your app will be at: http://localhost:3000
```

### Step 3: Build for Production
```bash
npm run build
# or
bun run build
```

This creates:
- `dist/` - Frontend assets (Vite build)
- `dist/server.cjs` - Bundled backend server

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts:
1. Link to existing Vercel project or create new
2. Set project name: `bt-vizion`
3. Root directory: `.` (current directory)
4. Build command: `npm run build` or `bun run build`
5. Output directory: `dist`

#### Option B: Using Vercel Web Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" -> "Project"
3. Import your GitHub repository (or upload files)
4. Configure project:
   - Framework: "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click "Deploy"

### Step 5: Add Environment Variables

In Vercel dashboard:
1. Go to your project
2. Navigate to "Settings" -> "Environment Variables"
3. Add these variables:
   - **Name**: `GEMINI_API_KEY`
     **Value**: `YOUR_GEMINI_API_KEY_HERE`
     **Visibility**: All environments
   
   - **Name**: `NODE_ENV`
     **Value**: `production`
     **Visibility**: All environments

### Step 6: Configure DNS for btvizion.co.za

#### At Your Domain Registrar (Where you bought btvizion.co.za):

**Option A: If using Vercel Nameservers (Easiest)**
1. In Vercel project settings, go to "Domains"
2. Add domain: `btvizion.co.za`
3. Vercel will provide nameservers (e.g., ns1.vercel-dns.com, ns2.vercel-dns.com)
4. At your domain registrar, change nameservers to Vercel's:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com

**Option B: If keeping current nameservers:**
1. In Vercel project settings, go to "Domains"
2. Add domain: `btvizion.co.za`
3. Vercel will show you DNS records to add
4. At your domain registrar, add these records:

   **For root domain (btvizion.co.za):**
   ```
   Type: A
   Name: @ or btvizion.co.za
   Value: [IP address Vercel provides]
   TTL: Automatic or 3600
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: Automatic or 3600
   ```

   **OR (Recommended) - Use CNAME for everything:**
   ```
   Type: CNAME
   Name: @ or btvizion.co.za
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

#### Common South African Registrars:

**1. DomainAfrica / domains.co.za:**
- Login to control panel
- Go to "My Domains" -> "btvizion.co.za"
- Click "Manage DNS" or "Name Servers"
- Either change nameservers OR add A/CNAME records

**2. Afrihost:**
- Login to client zone
- Go to "Domains" -> "Manage DNS"
- Update nameservers or DNS records

**3. WebAfrica / HostAfrica:**
- Login to control panel
- Navigate to DNS management
- Update as needed

**Verification:**
After adding DNS records, verify with:
```bash
# Check DNS propagation
nslookup btvizion.co.za

# Or use online tools:
# https://dnschecker.org/
# https://www.whatsmydns.net/
```

DNS changes typically take 15 minutes to 48 hours to propagate globally.

### Step 7: Enable Automatic SSL (Free)
Vercel automatically provisions SSL certificates via Let's Encrypt. Once DNS is configured:
1. Wait for DNS to propagate
2. Vercel will automatically create and install SSL certificate
3. Your site will be accessible via https://btvizion.co.za

### Step 8: Test Deployment
Once deployed and DNS is propagated:

1. **Health Check:**
   ```bash
   curl https://btvizion.co.za/api/health
   ```
   Should return: `{"status":"ok","hasKey":true}`

2. **Frontend:**
   Visit https://btvizion.co.za in your browser

3. **API Tests:**
   - Test chat: POST to `/api/chat`
   - Test image generation: POST to `/api/generate-image`
   - Test industry news: POST to `/api/industry-news`

### Step 9: Set Up Continuous Deployment (Optional)

1. Connect your GitHub/GitLab/Bitbucket repository to Vercel
2. Every `git push` to main branch will trigger automatic deployment
3. Environment variables are automatically inherited

### Troubleshooting

**Issue: Site loads but API returns 404**
- Check that `vercel.json` routes are correct
- Ensure build completed successfully in Vercel dashboard
- Verify server.ts is being deployed

**Issue: SSL not working**
- Wait 10-30 minutes after DNS configuration
- Check DNS propagation with dnschecker.org
- Ensure A/CNAME records are correct

**Issue: API returns 500 error**
- Check Vercel function logs in dashboard
- Verify GEMINI_API_KEY is set correctly
- Test with `curl -X POST https://btvizion.co.za/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello"}]}'`

**Issue: Static assets not loading**
- Check that `dist/` directory was uploaded
- Verify Vercel build completed without errors
- Clear browser cache

### Alternative Deployment: Railway.app

If you prefer Railway:

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Create `railway.json`:
   ```json
   {
     "services": {
       "web": {
         "start": "node dist/server.cjs",
         "build": "npm run build"
       }
     }
   }
   ```

3. Deploy:
   ```bash
   railway login
   railway init
   railway add
   railway up
   ```

4. Configure DNS:
   - Point btvizion.co.za to Railway's provided domain
   - Use CNAME or A records as provided by Railway

### Performance Tips

1. **Caching:** Vercel automatically caches static assets at the edge
2. **CDN:** All static files are served via Vercel's global CDN
3. **Image Optimization:** Consider using Vercel's Image Optimization if needed

### Monitoring

1. **Vercel Analytics:** Enable in project settings for traffic insights
2. **Logging:** View real-time logs in Vercel dashboard
3. **Error Tracking:** Use Vercel's built-in error monitoring

### Cost Estimation

- **Vercel:** Free for your traffic level (under 100GB bandwidth/month)
- **Domain:** Already owned (btvizion.co.za)
- **AI API:** Google Gemini costs separate (pay-as-you-go)

Total: **$0** for hosting + AI API usage costs

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod

# Check Vercel logs
vercel logs
```

## Domain Registrar DNS Examples

### For domains.co.za:
1. Login to https://domains.co.za
2. Go to "My Account" -> "My Domains"
3. Click on btvizion.co.za
4. Click "Manage DNS" or "Change DNS Settings"
5. **Option 1 - Change Nameservers:**
   - Delete existing nameservers
   - Add: ns1.vercel-dns.com
   - Add: ns2.vercel-dns.com
6. **Option 2 - Add Records:**
   - Add A record: @ -> [Vercel IP]
   - Add CNAME: www -> cname.vercel-dns.com

### For Afrihost:
1. Login to https://cp.afrihost.com
2. Go to "Domains" -> "My Domains"
3. Click "Manage" next to btvizion.co.za
4. Click "DNS Management"
5. Update nameservers or add A/CNAME records
