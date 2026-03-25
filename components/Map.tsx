'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    )
  }
);

export default function Map(props: React.ComponentProps<typeof LeafletMap>) {
  return <LeafletMap {...props} />;
}
