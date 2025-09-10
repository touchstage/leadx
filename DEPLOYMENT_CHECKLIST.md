# 🚀 LeadX Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Make sure these are configured in Vercel:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RlYWR5LWVzY2FyZ290LTQ0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_M1Sb5ZMkEkNyALbelS9KuCitQZo26nzuLb8gy0cdKD
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here

# Database (Use PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:port/database

# Azure OpenAI
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://demo-super.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-3-small
OPENAI_API_VERSION=2024-02-15-preview

# Razorpay
RAZORPAY_KEY_ID=rzp_live_RFb0HFEL2iK3Rs
RAZORPAY_KEY_SECRET=7X6RclqLri1ZYXB5ONf4gY9K
RAZORPAY_WEBHOOK_SECRET=whsec_your-actual-webhook-secret-here
```

### 2. **Database Migration**
Run Prisma migrations on production:
```bash
npx prisma migrate deploy
npx prisma generate
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy!

### Step 3: Get Your Domain
After deployment, you'll get:
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (optional)

### Step 4: Configure Razorpay Webhook
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → Webhooks
3. Add Webhook URL: `https://your-project-name.vercel.app/api/payments/webhook`
4. Select Events: `payment.captured`
5. Copy the Webhook Secret (starts with `whsec_`)
6. Update `RAZORPAY_WEBHOOK_SECRET` in Vercel

### Step 5: Configure Clerk Webhook
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Webhooks → Add Endpoint
3. URL: `https://your-project-name.vercel.app/api/webhooks/clerk`
4. Select Events: `user.created`, `user.updated`, `user.deleted`
5. Copy the Webhook Secret
6. Update `CLERK_WEBHOOK_SECRET` in Vercel

## 🧪 Post-Deployment Testing

### Test Payment Flow
1. Go to `/wallet`
2. Try adding credits
3. Check if Razorpay payment works
4. Verify credits are added after payment

### Test Authentication
1. Try signing up with Google/LinkedIn
2. Check if user data syncs properly
3. Test protected routes

### Test Intel Features
1. Post intel
2. Search for intel
3. Make requests
4. Test the complete flow

## 🔧 Production Database Setup

For production, you'll need a PostgreSQL database:

### Option 1: Vercel Postgres
1. Go to Vercel Dashboard
2. Storage → Create Database
3. Choose PostgreSQL
4. Copy the connection string

### Option 2: External Database
- **Supabase**: Free PostgreSQL hosting
- **Railway**: Easy PostgreSQL setup
- **PlanetScale**: MySQL alternative

## 📋 Environment Variables for Production

Make sure to update these in Vercel:

1. **Database**: Use PostgreSQL connection string
2. **Razorpay**: Use live keys (not test keys)
3. **Clerk**: Use production keys
4. **Webhooks**: Use actual webhook secrets

## 🎯 Success Criteria

✅ App loads without errors
✅ Authentication works (sign up/sign in)
✅ Payment flow works (buy credits)
✅ Intel posting works
✅ Search functionality works
✅ Webhooks are receiving events

## 🆘 Troubleshooting

### Common Issues:
1. **Build Errors**: Check environment variables
2. **Database Errors**: Ensure DATABASE_URL is correct
3. **Payment Issues**: Verify Razorpay keys and webhook
4. **Auth Issues**: Check Clerk configuration

### Debug Commands:
```bash
# Check build locally
npm run build

# Test database connection
npx prisma db push

# Check environment variables
node -e "console.log(process.env)"
```
