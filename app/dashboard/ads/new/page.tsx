'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    position: 'HOMEPAGE_BANNER',
    imageUrl: '',
    clickUrl: '',
    budget: 5000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard/ads');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Ad Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Ad Position</label>
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="HOMEPAGE_BANNER">Homepage Banner (728x90)</option>
            <option value="CATEGORY_BANNER">Category Banner (728x90)</option>
            <option value="LISTING_SIDEBAR">Sidebar Ad (300x250)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/ad.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Click URL</label>
          <input
            type="url"
            required
            value={form.clickUrl}
            onChange={(e) => setForm({ ...form, clickUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Budget (KSh)</label>
          <input
            type="number"
            required
            min="5000"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">Minimum KSh 5,000</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
}
