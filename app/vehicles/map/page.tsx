import Map from '@/components/Map';
import { vehicles } from '@/data/vehicles';

export default function MapPage() {
  const vehiclesWithCoords = vehicles
    .filter(v => v.seller.latitude && v.seller.longitude)
    .map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      image: v.images[0] || '',
      latitude: v.seller.latitude!,
      longitude: v.seller.longitude!,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-80 bg-white p-4 overflow-y-auto border-r">
          <h1 className="text-xl font-bold mb-4">Map View</h1>
          <p className="text-sm text-gray-600 mb-4">
            Showing {vehiclesWithCoords.length} vehicles on map
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Click on markers to see vehicle details
            </p>
          </div>
          <div className="mt-4">
            <a 
              href="/vehicles" 
              className="block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Switch to List View
            </a>
          </div>
        </aside>
        <main className="flex-1">
          <Map vehicles={vehiclesWithCoords} />
        </main>
      </div>
    </div>
  );
}
