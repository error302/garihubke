interface DealerStatsProps {
  totalListings: number;
  totalViews: number;
  totalInquiries: number;
  available: number;
  sold: number;
}

export default function DealerStats({ totalListings, totalViews, totalInquiries, available, sold }: DealerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Total Listings</p>
        <p className="text-3xl font-bold">{totalListings}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Total Views</p>
        <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Inquiries</p>
        <p className="text-3xl font-bold">{totalInquiries}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Sold</p>
        <p className="text-3xl font-bold">{sold}</p>
      </div>
    </div>
  );
}
