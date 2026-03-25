'use client';

import { useState, useEffect } from 'react';

interface Ad {
  id: string;
  imageUrl: string;
  clickUrl: string;
}

interface AdBannerProps {
  position: 'HOMEPAGE_BANNER' | 'CATEGORY_BANNER';
}

export default function AdBanner({ position }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      const res = await fetch(`/api/ads?position=${position}`);
      const data = await res.json();
      if (data.ads?.length > 0) {
        setAd(data.ads[0]);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    }
  };

  const handleClick = async () => {
    if (ad) {
      await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      });
      window.open(ad.clickUrl, '_blank');
    }
  };

  if (!ad) return null;

  return (
    <div className="w-full max-w-[728px] mx-auto my-8">
      <button onClick={handleClick} className="block w-full">
        <img
          src={ad.imageUrl}
          alt="Advertisement"
          className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        />
      </button>
      <p className="text-xs text-gray-400 text-center mt-1">Advertisement</p>
    </div>
  );
}
