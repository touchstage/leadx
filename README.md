# LeadX (Sales Intel Exchange) – MVP

## Setup

1. Copy `.env.example` to `.env.local` and fill values.
2. Ensure Postgres is available and `pgvector` extension installed.
3. Install deps: `npm install`
4. Generate client: `npx prisma generate`
5. Migrate DB: `npx prisma migrate dev --name init`
6. Start dev: `npm run dev`

## Notes
- Auth via NextAuth (Google/LinkedIn).
- Dollar-based pricing with free tier support; Stripe integration for payments.
- RAG: Azure OpenAI embeddings + pgvector search.
- API routes under `app/api/*`.
