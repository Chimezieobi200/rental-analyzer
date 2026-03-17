# PropAnalyzer – German Real Estate Investment Tool

A production-ready Next.js 14 application for analyzing German rental property investments.

## Features

- **Deal Score** (0-100) based on yield, cashflow, LTV, and vacancy
- **10-Year Projection** with rent growth and property appreciation
- **Cashflow Calculator** with German Annuitätendarlehen math
- **Scenario Simulator** – stress test with interest rate and rent changes
- **Amortization Schedule** – monthly/yearly Tilgungsplan
- **PDF Reports** – professional PDF export (Pro feature)
- **Supabase Auth** – email/password + Google OAuth
- **Stripe Payments** – Pro subscription via Stripe Checkout

---

## Setup Guide

### 1. Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- A Stripe account (test mode is fine)

### 2. Clone and Install

```bash
git clone <your-repo-url> rental-analyzer
cd rental-analyzer
npm install
```

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
4. Go to **Authentication > Providers** and enable:
   - **Email** (enabled by default)
   - **Google** (optional but recommended):
     - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
     - Add your Supabase callback URL: `https://<your-project>.supabase.co/auth/v1/callback`
5. Go to **Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Create a **Product**:
   - Name: `PropAnalyzer Pro`
   - Description: `Unlimited analyses + PDF reports`
4. Create a **Price**:
   - Type: Recurring
   - Amount: `19.00 EUR`
   - Billing: Monthly
5. Copy the **Price ID** (starts with `price_`) → `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
6. Go to **Developers > API Keys** and copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
7. Set up **Webhooks**:
   - Go to **Developers > Webhooks**
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Test Stripe Payments

In a separate terminal:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use Stripe's test card: `4242 4242 4242 4242` (any future date, any CVC)

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/rental-analyzer.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New > Project**
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Change `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g., `https://rental-analyzer.vercel.app`)
6. Deploy

### 3. Update Supabase OAuth Callback

In Supabase **Authentication > URL Configuration**:
- Site URL: `https://your-vercel-app.vercel.app`
- Redirect URLs: `https://your-vercel-app.vercel.app/api/auth/callback`

### 4. Update Stripe Webhook

Add your production URL to Stripe webhooks:
- `https://your-vercel-app.vercel.app/api/stripe/webhook`

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Landing page
│   ├── analyze/page.tsx        # Main analysis page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── auth/callback/      # Supabase OAuth callback
│       ├── calculate/          # Calculation API endpoint
│       ├── pdf/                # PDF generation endpoint
│       └── stripe/             # Stripe checkout + webhooks
├── components/
│   ├── forms/
│   │   └── PropertyInputForm.tsx
│   ├── dashboard/
│   │   ├── AnalysisDashboard.tsx
│   │   ├── DealScoreWidget.tsx
│   │   ├── KPICard.tsx
│   │   ├── ScenarioSimulator.tsx
│   │   └── AmortizationTable.tsx
│   ├── charts/
│   │   ├── CashflowChart.tsx
│   │   ├── LoanBalanceChart.tsx
│   │   └── WealthGrowthChart.tsx
│   ├── navigation/
│   │   └── Navbar.tsx
│   └── pdf/
│       └── InvestmentReport.tsx
├── lib/
│   ├── calculations.ts         # Core financial engine
│   ├── scenarios.ts            # Scenario simulator logic
│   ├── stripe.ts               # Stripe helpers
│   ├── utils.ts                # Formatting utilities
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       └── server.ts           # Server Supabase client
├── types/
│   └── index.ts                # All TypeScript types
└── middleware.ts                # Auth protection
```

---

## Financial Calculation Notes

### German Annuitätendarlehen
- Monthly payment = `(interestRate + repaymentRate) / 12 / 100 × loanAmount`
- Each month: `interest = balance × monthlyInterestRate`
- Principal = `monthlyPayment - interest`
- Balance decreases each month

### Deal Score (0-100)
| Category | Max Points | Criteria |
|----------|-----------|---------|
| Net Yield | 30 | ≥5%: 30, 4-5%: 20, 3-4%: 10 |
| Monthly Cashflow | 25 | ≥0: 25, -100 to 0: 15, -300 to -100: 5 |
| LTV | 25 | ≤70%: 25, 70-80%: 15, 80-90%: 5 |
| Vacancy Rate | 20 | ≤3%: 20, 3-5%: 15, 5-8%: 10 |

---

## License

MIT — use freely, no attribution required.

**Disclaimer:** This tool provides educational calculations only. Not financial advice.
