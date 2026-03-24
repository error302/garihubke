'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { makes, getModelsForMake, fuelTypes, transmissions, features as allFeatures } from '@/data/vehicles';

const categories = [
  { value: 'cars', label: 'Cars' },
  { value: 'motorbikes', label: 'Motorbikes' },
  { value: 'trucks', label: 'Trucks' },
  { value: 'vans', label: 'Vans' },
];

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    description: '',
    sellerName: '',
    sellerPhone: '',
    sellerLocation: '',
    features: [] as string[],
    images: '',
  });

  const updateField = (field: string, value: string | string[]) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      if (field === 'make' && value !== prev.make) {
        newForm.model = '';
      }
      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year),
          price: parseInt(form.price),
          mileage: form.mileage ? parseInt(form.mileage) : null,
          features: JSON.stringify(form.features),
          images: JSON.stringify(form.images.split(',').map((url: string) => url.trim()).filter(Boolean)),
        }),
      });

      if (res.ok) {
        router.push('/dashboard/listings');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const currentModels = form.make ? getModelsForMake(form.make) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Vehicle</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              minLength={5}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., 2019 Toyota Premio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                required
                min={1900}
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <select
                value={form.make}
                onChange={(e) => updateField('make', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select make</option>
                {makes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <select
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                required
                disabled={!form.make}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              >
                <option value="">Select model</option>
                {currentModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Price & Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                required
                min={0}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 1500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => updateField('mileage', e.target.value)}
                min={0}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
              <select
                value={form.fuelType}
                onChange={(e) => updateField('fuelType', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel} className="capitalize">{fuel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
              <select
                value={form.transmission}
                onChange={(e) => updateField('transmission', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select transmission</option>
                {transmissions.map((trans) => (
                  <option key={trans} value={trans} className="capitalize">{trans}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Description</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              minLength={20}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Describe your vehicle..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allFeatures.map((feature) => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('features', [...form.features, feature]);
                      } else {
                        updateField('features', form.features.filter((f) => f !== feature));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Seller Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              value={form.sellerName}
              onChange={(e) => updateField('sellerName', e.target.value)}
              required
              minLength={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={form.sellerPhone}
                onChange={(e) => updateField('sellerPhone', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 0722123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={form.sellerLocation}
                onChange={(e) => updateField('sellerLocation', e.target.value)}
                required
                minLength={2}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Nairobi"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Images</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
            <textarea
              value={form.images}
              onChange={(e) => updateField('images', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Submitting...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  );
}
