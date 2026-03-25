import { db } from '@/lib/db';
import VehicleGrid from '@/components/VehicleGrid';
import { SellerReviews } from '@/components/reviews/SellerReviews';
import { Vehicle } from '@/types';

export default async function PublicDealerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const dealer = await db.dealer.findUnique({
    where: { id, isDeleted: false, isSuspended: false },
    include: {
      inventory: {
        where: { stockStatus: 'AVAILABLE' },
        include: { listing: true },
      },
    },
  });

  if (!dealer) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold">Dealer Not Found</h1></div>;
  }

  const vehicles: Vehicle[] = dealer.inventory.map((i) => {
    const listing = i.listing;
    return {
      id: listing.id,
      title: listing.title,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage || 0,
      fuelType: listing.fuelType as Vehicle['fuelType'],
      transmission: listing.transmission as Vehicle['transmission'],
      description: listing.description,
      images: listing.images.split(',').filter(Boolean),
      seller: {
        name: listing.sellerName,
        phone: listing.sellerPhone,
        location: listing.sellerLocation,
      },
      features: listing.features.split(',').filter(Boolean),
      category: listing.category as Vehicle['category'],
      createdAt: listing.createdAt.toISOString(),
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-6">
          {dealer.logo ? (
            <img src={dealer.logo} alt={dealer.name} className="w-24 h-24 rounded-lg object-cover" />
          ) : (
            <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-600">{dealer.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {dealer.name}
              {dealer.isVerified && <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Verified</span>}
            </h1>
            {dealer.description && <p className="text-gray-600 mt-2">{dealer.description}</p>}
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              {dealer.city && <span>{dealer.city}</span>}
              {dealer.phone && <span>{dealer.phone}</span>}
            </div>
          </div>
        </div>
      </div>
      <SellerReviews sellerId={id} />
      <h2 className="text-2xl font-bold mb-6">Inventory ({dealer.inventory.length})</h2>
      <VehicleGrid vehicles={vehicles} />
    </div>
  );
}
