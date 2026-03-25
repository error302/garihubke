'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { vehicles } from '@/data/vehicles';
import VehicleGrid from '@/components/VehicleGrid';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'mileage-low', label: 'Mileage: Low to High' },
  { value: 'mileage-high', label: 'Mileage: High to Low' },
  { value: 'year-new', label: 'Year: Newest First' },
  { value: 'year-old', label: 'Year: Oldest First' },
];

function VehiclesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    make: searchParams.get('make') || '',
    model: '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    yearMin: searchParams.get('yearMin') || '',
    yearMax: searchParams.get('yearMax') || '',
    minMileage: '',
    maxMileage: '',
    seats: '',
    fuelType: [] as string[],
    transmission: [] as string[],
    region: searchParams.get('region') || '',
    city: searchParams.get('city') || '',
  });

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      result = result.filter((v) => v.category === filters.category);
    }
    if (filters.make) {
      result = result.filter((v) => v.make === filters.make);
    }
    if (filters.model) {
      result = result.filter((v) => v.model === filters.model);
    }
    if (filters.minPrice) {
      result = result.filter((v) => v.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((v) => v.price <= Number(filters.maxPrice));
    }
    if (filters.yearMin) {
      result = result.filter((v) => v.year >= Number(filters.yearMin));
    }
    if (filters.yearMax) {
      result = result.filter((v) => v.year <= Number(filters.yearMax));
    }
    if (filters.fuelType.length > 0) {
      result = result.filter((v) => filters.fuelType.includes(v.fuelType));
    }
    if (filters.transmission.length > 0) {
      result = result.filter((v) => filters.transmission.includes(v.transmission));
    }
    if (filters.region) {
      result = result.filter((v) => v.seller.county === filters.region);
    }
    if (filters.city) {
      result = result.filter((v) => v.seller.city === filters.city);
    }
    if (filters.minMileage) {
      result = result.filter((v) => v.mileage >= Number(filters.minMileage));
    }
    if (filters.maxMileage) {
      result = result.filter((v) => v.mileage <= Number(filters.maxMileage));
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'mileage-low':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'mileage-high':
        result.sort((a, b) => b.mileage - a.mileage);
        break;
      case 'year-new':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        result.sort((a, b) => a.year - b.year);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.make) params.set('make', newFilters.make);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.region) params.set('region', newFilters.region);
    if (newFilters.city) params.set('city', newFilters.city);
    router.push(`/vehicles?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      make: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      yearMin: '',
      yearMax: '',
      minMileage: '',
      maxMileage: '',
      seats: '',
      fuelType: [],
      transmission: [],
      region: '',
      city: '',
    });
    setSearchQuery('');
    router.push('/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-full mb-4 px-4 py-2 border rounded-lg flex items-center justify-between"
          >
            <span>Filters</span>
            <svg className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-gray-600">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm flex-1 sm:flex-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <VehicleGrid vehicles={paginatedVehicles} onReset={handleResetFilters} />

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 border rounded-md disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-2 border rounded-md text-sm ${
                    currentPage === page ? 'bg-primary-600 text-white' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 border rounded-md disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 rounded w-full max-w-2xl mx-auto" />
        <div className="flex gap-8">
          <div className="w-64 space-y-4 hidden lg:block">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-72" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VehiclesContent />
    </Suspense>
  );
}
