'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/types';

interface InsuranceCalculatorProps {
  vehicle: Vehicle;
}

const insurers = [
  { id: 'jubi', name: 'Jubilee Insurance' },
  { id: 'aig', name: 'AIG Kenya' },
  { id: 'old', name: 'Old Mutual' },
  { id: 'biz', name: 'Bizcover' },
];

export function InsuranceCalculator({ vehicle }: InsuranceCalculatorProps) {
  const [vehicleValue, setVehicleValue] = useState(vehicle.price);
  const [year, setYear] = useState(vehicle.year);
  const [vehicleType, setVehicleType] = useState<string>(vehicle.category);
  const [comprehensive, setComprehensive] = useState(0);
  const [thirdParty, setThirdParty] = useState(0);
  const [roadTax, setRoadTax] = useState(0);
  const [registration, setRegistration] = useState(0);

  useEffect(() => {
    calculateCosts();
  }, [vehicleValue, year, vehicleType]);

  const calculateCosts = () => {
    const comprehensiveRate = vehicleValue > 5000000 ? 0.03 : vehicleValue > 2000000 ? 0.035 : 0.04;
    const compPremium = Math.round(vehicleValue * comprehensiveRate);
    setComprehensive(compPremium);

    const tpBase = { cars: 25000, motorbikes: 15000, trucks: 35000, vans: 20000 };
    setThirdParty(tpBase[vehicleType as keyof typeof tpBase] || 20000);

    const engineSize = vehicle.engineSize || 2000;
    if (engineSize < 1500) setRoadTax(15000);
    else if (engineSize < 2000) setRoadTax(20000);
    else if (engineSize < 3000) setRoadTax(25000);
    else if (engineSize < 4000) setRoadTax(35000);
    else setRoadTax(50000);

    setRegistration(2500);
  };

  const totalAnnual = comprehensive + roadTax + registration;
  const totalThirdParty = thirdParty + roadTax + registration;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Insurance Calculator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Vehicle Value (KES)</label>
          <input
            type="number"
            value={vehicleValue}
            onChange={(e) => setVehicleValue(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="cars">Car</option>
            <option value="motorbikes">Motorcycle</option>
            <option value="trucks">Truck</option>
            <option value="vans">Van</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Comprehensive</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Premium</span>
              <span>KES {comprehensive.toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Road Tax</span>
              <span>KES {roadTax.toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registration</span>
              <span>KES {registration.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">KES {totalAnnual.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Third Party</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Premium</span>
              <span>KES {thirdParty.toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Road Tax</span>
              <span>KES {roadTax.toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registration</span>
              <span>KES {registration.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">KES {totalThirdParty.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Get Quotes from Partners</h4>
        <div className="flex flex-wrap gap-3">
          {insurers.map((insurer) => (
            <button
              key={insurer.id}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Get Quote from {insurer.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
