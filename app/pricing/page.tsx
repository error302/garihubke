'use client';

import { useState } from 'react';
import PricingCard from '@/components/PricingCard';

const plans = [
  {
    tier: 'Basic',
    price: 0,
    features: [
      '1 active listing',
      '30-day duration',
      'Up to 10 photos',
      'Basic search visibility',
    ],
  },
  {
    tier: 'Pro',
    price: 2500,
    features: [
      '5 active listings',
      'Featured placement',
      'Verified badge',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    tier: 'Business',
    price: 5000,
    features: [
      'Unlimited listings',
      'Premium placement',
      'Verified badge',
      'Analytics dashboard',
      'Dedicated support',
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (tier: string) => {
    if (tier === 'Basic') return;
    setLoading(tier);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-gray-600 mb-12">
        Select the perfect plan for selling vehicles on GariHub
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.tier}
            tier={plan.tier}
            price={plan.price}
            features={plan.features}
            isPopular={plan.isPopular}
            onSelect={() => handleSelect(plan.tier.toUpperCase())}
            isLoading={loading === plan.tier.toUpperCase()}
          />
        ))}
      </div>
    </div>
  );
}
