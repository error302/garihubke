'use client';

interface PricingCardProps {
  tier: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export default function PricingCard({
  tier,
  price,
  features,
  isPopular,
  onSelect,
  isLoading,
}: PricingCardProps) {
  return (
    <div
      className={`relative bg-white rounded-lg shadow-md p-8 ${
        isPopular ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{tier}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">
          {price === 0 ? 'Free' : `KSh ${price.toLocaleString()}`}
        </span>
        {price > 0 && <span className="text-gray-500">/month</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isPopular
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {isLoading ? 'Loading...' : price === 0 ? 'Current Plan' : 'Get Started'}
      </button>
    </div>
  );
}
