import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

export const stripe = {
  get isReady() {
    return !!process.env.STRIPE_SECRET_KEY;
  }
} as unknown as Stripe & { isReady: boolean };

export const PRICES = {
  PRO_MONTHLY: 250000,
  BUSINESS_MONTHLY: 500000,
};

export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || '',
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID || '',
};
