'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';

export default function UploadPage() {
  const [results, setResults] = useState<any>(null);

  const handleUpload = async (csvContent: string) => {
    setResults({ created: 0, message: 'Demo mode - upload would process here' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bulk Upload Listings</h1>
      <a href="/templates/upload-template.csv" download className="text-primary-600 hover:underline mb-4 block">
        Download CSV Template
      </a>
      <UploadZone onUpload={handleUpload} />
      {results && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-800">
            Successfully created {results.created} listings!
          </p>
        </div>
      )}
    </div>
  );
}
