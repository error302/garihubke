'use client';

import { useState } from 'react';
import { makes, getModelsForMake } from '@/data/vehicles';
import { KENYA_COUNTIES, MAJOR_CITIES } from '@/lib/kenya-regions';
import { useSession } from 'next-auth/react';
import { PriceRangeSlider } from './PriceRangeSlider';

interface FilterSidebarProps {
  filters: {
    category: string;
    make: string;
    model: string;
    minPrice: string;
    maxPrice: string;
    yearMin: string;
    yearMax: string;
    minMileage: string;
    maxMileage: string;
    seats: string;
    fuelType: string[];
    transmission: string[];
    bodyType: string;
    color: string;
    engineSize: string;
    region: string;
    city: string;
    sortBy: string;
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
const transmissions = ['manual', 'automatic'];

const bodyTypes = [
  { value: '', label: 'All Body Types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus' },
];

const colors = [
  { value: '', label: 'All Colors' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'silver', label: 'Silver' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'brown', label: 'Brown' },
  { value: 'other', label: 'Other' },
];

const engineSizes = [
  { value: '', label: 'Any Engine' },
  { value: 'below_1500', label: 'Below 1500cc' },
  { value: '1500_2000', label: '1500 - 2000cc' },
  { value: '2000_3000', label: '2000 - 3000cc' },
  { value: '3000_4000', label: '3000 - 4000cc' },
  { value: 'above_4000', label: 'Above 4000cc' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'cars', label: 'Cars' },
  { value: 'motorbikes', label: 'Motorbikes' },
  { value: 'trucks', label: 'Trucks' },
  { value: 'vans', label: 'Vans' },
];
const seatOptions = ['2', '4', '5', '6', '7', '8+'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'mileage_asc', label: 'Mileage: Low to High' },
  { value: 'mileage_desc', label: 'Mileage: High to Low' },
];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const { data: session } = useSession();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const handleMakeChange = (make: string) => {
    onFilterChange({ ...filters, make, model: '' });
  };

  const handleFuelTypeToggle = (fuel: string) => {
    const newFuelTypes = filters.fuelType.includes(fuel)
      ? filters.fuelType.filter(f => f !== fuel)
      : [...filters.fuelType, fuel];
    onFilterChange({ ...filters, fuelType: newFuelTypes });
  };

  const handleTransmissionToggle = (trans: string) => {
    const newTransmissions = filters.transmission.includes(trans)
      ? filters.transmission.filter(t => t !== trans)
      : [...filters.transmission, trans];
    onFilterChange({ ...filters, transmission: newTransmissions });
  };

  const resetFilters = () => {
    onFilterChange({
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
      bodyType: '',
      color: '',
      engineSize: '',
      region: '',
      city: '',
      sortBy: 'newest',
    });
  };

  const handleSaveSearch = async () => {
    if (!saveName.trim()) return;
    setSaveLoading(true);
    
    try {
      await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName, filters }),
      });
      setShowSaveModal(false);
      setSaveName('');
    } catch (err) {
      console.error('Failed to save search:', err);
    }
    
    setSaveLoading(false);
  };

  const hasActiveFilters = filters.category || filters.make || filters.model || 
    filters.minPrice || filters.maxPrice || filters.yearMin || filters.yearMax ||
    filters.minMileage || filters.maxMileage || filters.seats ||
    filters.fuelType.length > 0 || filters.transmission.length > 0 ||
    filters.bodyType || filters.color || filters.engineSize ||
    filters.region || filters.city || (filters.sortBy && filters.sortBy !== 'newest');

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 font-medium"
      >
        Clear All Filters
      </button>

      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={filters.sortBy || 'newest'}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <PriceRangeSlider
          min={0}
          max={20000000}
          value={[Number(filters.minPrice) || 0, Number(filters.maxPrice) || 20000000]}
          onChange={([min, max]) => onFilterChange({ 
            ...filters, 
            minPrice: min.toString(), 
            maxPrice: max.toString() 
          })}
        />
      </div>

      <div>
        <h3 className="font-semibold mb-3">Make</h3>
        <select
          value={filters.make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {filters.make && (
        <div>
          <h3 className="font-semibold mb-3">Model</h3>
          <select
            value={filters.model}
            onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Models</option>
            {getModelsForMake(filters.make).map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Year</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.yearMin}
            onChange={(e) => onFilterChange({ ...filters, yearMin: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="To"
            value={filters.yearMax}
            onChange={(e) => onFilterChange({ ...filters, yearMax: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Mileage (km)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minMileage}
            onChange={(e) => onFilterChange({ ...filters, minMileage: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxMileage}
            onChange={(e) => onFilterChange({ ...filters, maxMileage: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {filters.category === 'cars' && (
        <div>
          <h3 className="font-semibold mb-3">Seats</h3>
          <select
            value={filters.seats}
            onChange={(e) => onFilterChange({ ...filters, seats: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">Any</option>
            {seatOptions.map((seats) => (
              <option key={seats} value={seats}>{seats} seats</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {fuelTypes.map((fuel) => (
            <label key={fuel} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(fuel)}
                onChange={() => handleFuelTypeToggle(fuel)}
                className="rounded"
              />
              <span className="text-sm capitalize">{fuel}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {transmissions.map((trans) => (
            <label key={trans} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transmission.includes(trans)}
                onChange={() => handleTransmissionToggle(trans)}
                className="rounded"
              />
              <span className="text-sm capitalize">{trans}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Body Type</h3>
        <select
          value={filters.bodyType}
          onChange={(e) => onFilterChange({ ...filters, bodyType: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {bodyTypes.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Color</h3>
        <select
          value={filters.color}
          onChange={(e) => onFilterChange({ ...filters, color: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {colors.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Engine Size</h3>
        <select
          value={filters.engineSize}
          onChange={(e) => onFilterChange({ ...filters, engineSize: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {engineSizes.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <select
          value={filters.region}
          onChange={(e) => onFilterChange({ ...filters, region: e.target.value, city: '' })}
          className="w-full px-3 py-2 border rounded-md text-sm mb-2"
        >
          <option value="">All Counties</option>
          {KENYA_COUNTIES.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
        {filters.region && MAJOR_CITIES[filters.region] && (
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Cities</option>
            {MAJOR_CITIES[filters.region].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}
      </div>

      {session && hasActiveFilters && (
        <button
          onClick={() => setShowSaveModal(true)}
          className="w-full px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Save This Search
        </button>
      )}

      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
      >
        Reset Filters
      </button>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Search</h3>
            <input
              type="text"
              placeholder="Search name (e.g., 'Toyota under 2M')"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveSearch}
                disabled={saveLoading || !saveName.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saveLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
