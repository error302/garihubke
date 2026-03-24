'use client';

import { makes, getModelsForMake } from '@/data/vehicles';

interface FilterSidebarProps {
  filters: {
    category: string;
    make: string;
    model: string;
    minPrice: string;
    maxPrice: string;
    yearMin: string;
    yearMax: string;
    fuelType: string[];
    transmission: string[];
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
const transmissions = ['manual', 'automatic'];
const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'cars', label: 'Cars' },
  { value: 'motorbikes', label: 'Motorbikes' },
  { value: 'trucks', label: 'Trucks' },
  { value: 'vans', label: 'Vans' },
];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
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
      fuelType: [],
      transmission: [],
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
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
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
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

      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );
}
