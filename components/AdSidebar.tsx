'use client';

import { useState, useEffect } from 'react';

interface Ad {
  id: string;
  imageUrl: string;
  clickUrl: string;
}

export default function AdSidebar() {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads?position=LISTING_SIDEBAR');
      const data = await res.json();
      setAds(data.ads?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleClick = async (adId: string, clickUrl: string) => {
    await fetch('/api/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId }),
    });
    window.open(clickUrl, '_blank');
  };

  if (ads.length === 0) return null;

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <button
          key={ad.id}
          onClick={() => handleClick(ad.id, ad.clickUrl)}
          className="block w-full"
        >
          <img
            src={ad.imageUrl}
            alt="Advertisement"
            className="w-full h-[250px] object-cover rounded-lg cursor-pointer hover:opacity-90"
          />
        </button>
      ))}
      <p className="text-xs text-gray-400 text-center">Advertisement</p>
    </div>
  );
}
