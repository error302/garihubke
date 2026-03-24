import Link from 'next/link';
import { vehicles, categories } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const featuredVehicles = [...vehicles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Vehicle in Kenya
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Browse thousands of cars, motorbikes, trucks, and vans from trusted sellers
          </p>
          <div className="flex justify-center px-4">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold">Featured Vehicles</h2>
            <Link 
              href="/vehicles" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 sm:mb-8 text-center">Browse by Category</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/vehicles?category=${category.id}`}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <span className="text-3xl sm:text-4xl block mb-2">{category.icon}</span>
                <h3 className="font-semibold text-base sm:text-lg">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} vehicles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Want to Sell Your Vehicle?
          </h2>
          <p className="text-primary-100 text-lg mb-6 sm:mb-8 px-4">
            List your vehicle on GariHub and reach thousands of potential buyers
          </p>
          <Link
            href="/sell"
            className="inline-block px-6 sm:px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sell Your Vehicle
          </Link>
        </div>
      </section>
    </div>
  );
}
