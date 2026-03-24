import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

// Pricing configuration (in KSh - amount in cents)
export const PRICES = {
  PRO_MONTHLY: 250000, // KSh 2,500 in cents
  BUSINESS_MONTHLY: 500000, // KSh 5,000 in cents
};

export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || '',
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID || '',
};
