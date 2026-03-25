'use client';

import { useState } from 'react';

interface UploadZoneProps {
  onUpload: (content: string) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const content = await file.text();
      await onUpload(content);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        id="csv-upload"
        disabled={loading}
      />
      <label htmlFor="csv-upload" className="cursor-pointer">
        <p className="text-lg font-medium">
          {loading ? 'Uploading...' : 'Drop CSV file here or click to browse'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Max 500 rows, 5MB</p>
      </label>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
