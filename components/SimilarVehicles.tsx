import { vehicles } from '@/data/vehicles';
import { Vehicle } from '@/types';
import VehicleCard from './VehicleCard';

interface SimilarVehiclesProps {
  currentVehicle: Vehicle;
  limit?: number;
}

export default function SimilarVehicles({ currentVehicle, limit = 4 }: SimilarVehiclesProps) {
  const similar = vehicles
    .filter((v) => v.category === currentVehicle.category && v.id !== currentVehicle.id)
    .slice(0, limit);

  if (similar.length === 0) {
    const others = vehicles.filter((v) => v.id !== currentVehicle.id).slice(0, limit);
    if (others.length === 0) return null;
    
    return (
      <div className="mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {others.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Similar Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {similar.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
