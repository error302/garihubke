'use client';

import { useState, useEffect } from 'react';

interface Analytics {
  totalViews: number;
  totalInquiries: number;
  viewsOverTime: { date: string; views: number }[];
  topLocations: { location: string; views: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!analytics) return <div className="text-center py-12">No analytics data</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Views</p>
          <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Inquiries</p>
          <p className="text-3xl font-bold">{analytics.totalInquiries.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">CTR</p>
          <p className="text-3xl font-bold">
            {analytics.totalViews > 0
              ? ((analytics.totalInquiries / analytics.totalViews) * 100).toFixed(2) + '%'
              : '0%'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Views Over Time</h2>
        <div className="space-y-2">
          {analytics.viewsOverTime.map((item) => (
            <div key={item.date} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">{item.date}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div
                  className="bg-primary-500 h-4 rounded-full"
                  style={{ width: `${(item.views / analytics.totalViews) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-16 text-right">{item.views}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Top Locations</h2>
        <ul className="space-y-2">
          {analytics.topLocations.map((loc) => (
            <li key={loc.location} className="flex justify-between">
              <span>{loc.location}</span>
              <span className="font-medium">{loc.views}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
