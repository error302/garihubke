export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">About GariHub</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
          GariHub is Kenya&apos;s leading online vehicle marketplace, connecting buyers and sellers 
          across the country.
        </p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6 sm:mb-8">
          We aim to make buying and selling vehicles in Kenya simple, transparent, and secure. 
          Whether you&apos;re looking for a family car, a business truck, or a motorcycle, 
          GariHub has you covered.
        </p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 sm:mb-8">
          <li>Wide selection of vehicles from trusted sellers</li>
          <li>Easy-to-use search and filter options</li>
          <li>Verified seller contacts</li>
          <li>Detailed vehicle information and photos</li>
          <li>Free to browse - no hidden fees</li>
        </ul>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Have questions? Reach out to us at info@garihubke.com or call +254 700 000 000
        </p>
      </div>
    </div>
  );
}
