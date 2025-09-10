# LeadX Backend Integration Guide

## 🚀 Backend Integration Status

### ✅ Completed Integrations

1. **Search API** (`/api/search`)
   - POST endpoint for AI-powered search
   - Returns intel and demands based on query
   - Integrated with frontend search functionality

2. **Intel Management**
   - `GET /api/intel/list` - List all intel
   - `GET /api/intel/get?id=...` - Get specific intel
   - `POST /api/intel/create` - Create new intel (auth required)
   - `POST /api/intel/purchase` - Purchase intel (auth required)
   - `POST /api/intel/validate` - Validate intel (auth required)

3. **Demands Management**
   - `GET /api/demands/list` - List all demands
   - `POST /api/demands/create` - Create new demand (auth required)
   - `POST /api/demands/accept` - Accept demand fulfillment (auth required)
   - `POST /api/demands/fulfill` - Fulfill demand (auth required)

4. **Payment Integration (Razorpay)**
   - `POST /api/payments/create-order` - Create payment order (auth required)
   - `POST /api/payments/webhook` - Handle payment webhooks
   - Integrated with wallet page for credit purchases

5. **Wallet Management**
   - `POST /api/wallet/buy-credits` - Buy credits (legacy Stripe)
   - `POST /api/wallet/cashout` - Cash out credits (auth required)

6. **Authentication**
   - NextAuth.js integration
   - Google, LinkedIn, and email/password auth
   - Session management across all protected routes

### 🔧 Frontend-Backend Data Flow

#### Search Flow
1. User enters search query in `/ask` page
2. Frontend calls `POST /api/search` with query
3. Backend processes query and returns matching intel/demands
4. Frontend displays results with proper formatting

#### Intel Creation Flow
1. User fills form in `/post-intel` page
2. Frontend calls `POST /api/intel/create` with form data
3. Backend validates data and creates intel record
4. Frontend shows success message and resets form

#### Payment Flow (Razorpay)
1. User enters amount in wallet page
2. Frontend calls `POST /api/payments/create-order`
3. Backend creates Razorpay order and returns order details
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay webhook updates user credits

### 🛠️ Environment Variables Required

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Azure OpenAI
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-3-large
OPENAI_API_VERSION=2025-01-01-preview

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
```

### 🧪 Testing Backend Integration

Run the test script to verify all endpoints:

```bash
node test-backend-integration.js
```

Or test individual endpoints:

```bash
# Test search
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"fintech companies UAE CRM"}'

# Test intel list
curl -X GET http://localhost:3000/api/intel/list

# Test demands list
curl -X GET http://localhost:3000/api/demands/list
```

### 🔐 Authentication Flow

1. User visits protected route
2. Middleware checks for valid session
3. If no session, redirects to login
4. After login, user is redirected back to original route
5. All API calls include session validation

### 💳 Payment Integration Details

#### Razorpay Setup
1. Create Razorpay account and get API keys
2. Add keys to environment variables
3. Set up webhook endpoint: `https://yourdomain.com/api/payments/webhook`
4. Configure webhook events: `payment.captured`

#### Payment Flow
1. User clicks "Add Funds" in wallet
2. Frontend creates payment order via API
3. Razorpay checkout opens
4. User completes payment
5. Webhook updates user credits
6. Frontend refreshes to show new balance

### 📊 Database Schema

The system uses Prisma with SQLite for development:

- **User**: User accounts and authentication
- **Intel**: Sales intelligence listings
- **Demand**: Intelligence requests
- **CreditsLedger**: Credit transactions
- **Transaction**: Payment records

### 🚨 Error Handling

All API endpoints include proper error handling:
- 400: Bad request (missing/invalid data)
- 401: Unauthorized (no valid session)
- 404: Not found
- 500: Server error

Frontend displays appropriate error messages to users.

### 🔄 Data Synchronization

- Real-time updates via API calls
- Optimistic UI updates where appropriate
- Proper loading states and error handling
- Form validation on both frontend and backend

### 📱 Mobile Responsiveness

All pages are fully responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

### 🎨 UI/UX Consistency

- Modern design system with rounded corners
- Consistent color scheme (stone palette)
- Smooth animations and transitions
- Proper loading states and feedback
- Accessible form controls and navigation

## 🚀 Next Steps

1. **Production Deployment**
   - Set up production database (PostgreSQL)
   - Configure production environment variables
   - Set up SSL certificates
   - Configure domain and DNS

2. **Enhanced Features**
   - Real-time notifications
   - Advanced search filters
   - User profiles and ratings
   - Analytics dashboard

3. **Performance Optimization**
   - Implement caching
   - Optimize database queries
   - Add pagination
   - Implement search indexing

4. **Security Enhancements**
   - Rate limiting
   - Input sanitization
   - CSRF protection
   - Audit logging
