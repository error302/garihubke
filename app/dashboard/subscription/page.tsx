'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscription {
  tier: string;
  status: string;
  endDate: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Subscription</h1>

      {subscription ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Current Plan: <span className="text-primary-600">{subscription.tier}</span>
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                subscription.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {subscription.status}
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Valid until: {new Date(subscription.endDate).toLocaleDateString()}
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Change Plan
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don&apos;t have an active subscription.</p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
