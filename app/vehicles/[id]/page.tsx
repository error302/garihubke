import { notFound } from 'next/navigation';
import { vehicles } from '@/data/vehicles';
import ImageGallery from '@/components/ImageGallery';
import SellerCard from '@/components/SellerCard';
import SimilarVehicles from '@/components/SimilarVehicles';
import { ContactForm } from '@/components/messaging/ContactForm';
import { formatPrice } from '@/lib/utils';

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { id } = await params;
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <ImageGallery images={vehicle.images} title={vehicle.title} />
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{vehicle.title}</h1>
            <p className="text-2xl sm:text-3xl text-primary-600 font-bold mt-2">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Mileage</p>
                <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Fuel Type</p>
                <p className="font-medium capitalize">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Transmission</p>
                <p className="font-medium capitalize">{vehicle.transmission}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Make</p>
                <p className="font-medium">{vehicle.make}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <SellerCard seller={vehicle.seller} />
            <ContactForm vehicleId={vehicle.id} vehicleTitle={vehicle.title} />
          </div>
        </div>
      </div>

      <SimilarVehicles currentVehicle={vehicle} />
    </div>
  );
}
