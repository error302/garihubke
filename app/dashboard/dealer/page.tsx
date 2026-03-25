'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DealerStats from '@/components/DealerStats';

export default function DealerDashboardPage() {
  const [stats, setStats] = useState({ totalListings: 0, totalViews: 0, totalInquiries: 0, available: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dealer Dashboard</h1>
      <DealerStats {...stats} />
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Link href="/dashboard/dealer/upload" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Bulk Upload</h3>
          <p className="text-gray-600">Upload multiple listings via CSV</p>
        </Link>
        <Link href="/dashboard/dealer/team" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-gray-600">Invite and manage team members</p>
        </Link>
        <Link href="/dashboard/dealer/profile" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">Update your dealer profile</p>
        </Link>
        <Link href="/dashboard/dealer/api" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">API Access</h3>
          <p className="text-gray-600">Manage API keys and webhooks</p>
        </Link>
      </div>
    </div>
  );
}
