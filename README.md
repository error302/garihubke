# GariHub - Kenya's Vehicle Marketplace

A comprehensive vehicle marketplace built with Next.js for the Kenyan market.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth.js, Prisma
- **Database:** SQLite (development), ready for PostgreSQL (production)
- **Payments:** Stripe integration
- **Maps:** Leaflet for Kenya maps
- **Mobile:** Expo (React Native) app

## Features

### Core
- Vehicle listings with advanced search
- User authentication (email, Google OAuth)
- Favorites and saved searches
- Seller profiles and dealer portals

### Regional (Kenya-specific)
- 47 Kenya counties with delivery rates
- Location-based filtering
- Interactive map view

### Monetization
- Premium listings
- Ad campaigns
- Subscription plans (Pro, Business)

### Admin
- Dashboard analytics
- Tax rate management
- Order management
- Notification system

### SEO
- Dynamic sitemap
- robots.txt
- Open Graph metadata

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Run development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## License

MIT
