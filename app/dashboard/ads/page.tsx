'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CampaignStats from '@/components/CampaignStats';

interface AdCampaign {
  id: string;
  position: string;
  imageUrl: string;
  clickUrl: string;
  impressions: number;
  clicks: number;
  budget: number;
  costPerClick: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function AdsDashboardPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setCampaigns(data.ads || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.clicks * (c.costPerClick || 50), 0);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ad Campaigns</h1>
        <Link
          href="/dashboard/ads/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create Campaign
        </Link>
      </div>

      <CampaignStats
        impressions={totalImpressions}
        clicks={totalClicks}
        budget={totalBudget}
        spent={totalSpent}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns yet. Create your first campaign!</p>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
              >
                <img
                  src={campaign.imageUrl}
                  alt="Ad"
                  className="w-32 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{campaign.position.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">{campaign.clickUrl}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{campaign.impressions.toLocaleString()} views</p>
                  <p className="text-sm text-gray-500">{campaign.clicks.toLocaleString()} clicks</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {campaign.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
