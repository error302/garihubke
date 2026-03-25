'use client';

import { useState } from 'react';
import { KENYA_COUNTIES } from '@/lib/kenya-regions';

interface DeliveryCalculatorProps {
  sellerCounty: string;
}

export default function DeliveryCalculator({ sellerCounty }: DeliveryCalculatorProps) {
  const [toCounty, setToCounty] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!toCounty || toCounty === sellerCounty) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCounty: sellerCounty, toCounty }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Delivery Calculator</h3>
      <p className="text-sm text-gray-600 mb-3">
        Seller location: <span className="font-medium">{sellerCounty}</span>
      </p>
      
      <select
        value={toCounty}
        onChange={(e) => setToCounty(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm mb-3"
      >
        <option value="">Select delivery county</option>
        {KENYA_COUNTIES.filter(c => c !== sellerCounty).map(county => (
          <option key={county} value={county}>{county}</option>
        ))}
      </select>

      <button
        onClick={calculate}
        disabled={!toCounty || loading}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm"
      >
        {loading ? 'Calculating...' : 'Calculate Delivery Fee'}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Distance:</span>
            <span>{result.distanceKm} km</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Base fee:</span>
            <span>KES {result.baseFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Distance fee:</span>
            <span>KES {result.distanceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary-600">KES {result.totalFee.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}