'use client';

import { useState, useEffect } from 'react';

interface PremiumListing {
  id: string;
  feature: string;
  expiresAt: string;
  listing: { title: string };
}

export default function PremiumListingsPage() {
  const [premiums, setPremiums] = useState<PremiumListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiums();
  }, []);

  const fetchPremiums = async () => {
    try {
      const res = await fetch('/api/premium');
      const data = await res.json();
      setPremiums(data.premiums || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Features</h1>

      {premiums.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No premium features yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {premiums.map((premium) => (
            <div key={premium.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{premium.listing?.title || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {premium.feature.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Expires</p>
                  <p className="font-medium">
                    {new Date(premium.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
