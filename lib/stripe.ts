import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

// Pricing configuration (in KSh - amount in cents)
export const PRICES = {
  PRO_MONTHLY: 250000, // KSh 2,500 in cents
  BUSINESS_MONTHLY: 500000, // KSh 5,000 in cents
};

export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || '',
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID || '',
};
