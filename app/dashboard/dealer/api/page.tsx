'use client';

import { useState, useEffect } from 'react';

export default function ApiPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Access</h1>
      <button className="mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Generate New API Key</button>
      <div className="space-y-2">
        {keys.length === 0 ? (
          <p className="text-gray-500">No API keys yet.</p>
        ) : (
          keys.map((key) => (
            <div key={key.id} className="flex justify-between items-center bg-white rounded-lg shadow p-4">
              <div>
                <p className="font-medium">{key.name}</p>
                <p className="text-sm text-gray-500">Created {new Date(key.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {key.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
