import Link from 'next/link';
import { KENYA_COUNTIES } from '@/lib/kenya-regions';

export const metadata = {
  title: 'Import Calculator - Estimate Vehicle Import Costs | GariHub',
  description: 'Calculate import duties, taxes, and total costs for importing a vehicle to Kenya. Get a free broker quote.',
};

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Import Calculator</h1>
        <p className="text-gray-600">
          Estimate import duties, taxes, and total costs for your vehicle
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Value (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of Manufacture
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select year</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={2026 - i}>
                  {2026 - i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="saloon">Saloon Car</option>
              <option value="suv">SUV / 4x4</option>
              <option value="pickup">Pickup Truck</option>
              <option value="van">Van / Minibus</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck / Lorry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port of Entry
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="mombasa">Mombasa Port</option>
              <option value="nakuru">Nakuru ICD</option>
              <option value="nairobi">Nairobi ICD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery County
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select county</option>
              {KENYA_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine Capacity (cc)
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="1500">Below 1500cc</option>
              <option value="1800">1500 - 2000cc</option>
              <option value="2500">2000 - 3000cc</option>
              <option value="3500">3000 - 4000cc</option>
              <option value="4000">Above 4000cc</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Get accurate estimates - create a free account
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Save & Get Broker Quote
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-medium mb-2">Enter Vehicle Details</h3>
            <p className="text-sm text-gray-600">Input value, year, and vehicle type</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-medium mb-2">Calculate Duties</h3>
            <p className="text-sm text-gray-600">We estimate taxes and fees</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-medium mb-2">Get Quote</h3>
            <p className="text-sm text-gray-600">Get a detailed breakdown</p>
          </div>
        </div>
      </div>
    </div>
  );
}
