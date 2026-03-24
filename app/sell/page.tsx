import Link from 'next/link';

export default function SellPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Sell Your Vehicle</h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
        Sell your vehicle on Kenya&apos;s leading marketplace
      </p>
      
      <div className="bg-primary-50 p-6 sm:p-8 rounded-lg mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Coming Soon!</h2>
        <p className="text-gray-700">
          We&apos;re working on launching seller listings. Stay tuned!
        </p>
      </div>
      
      <p className="text-gray-600 mb-6 sm:mb-8">
        In the meantime, you can list your vehicle on other platforms or contact us directly.
      </p>
      
      <Link
        href="/contact"
        className="inline-block px-6 sm:px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Contact Us
      </Link>
    </div>
  );
}
