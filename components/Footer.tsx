import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">GariHub</h3>
            <p className="text-gray-400">Kenya&apos;s trusted vehicle marketplace. Find your perfect ride today.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/vehicles" className="text-gray-400 hover:text-white">Browse Vehicles</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-white">Sell Your Car</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/vehicles?category=cars" className="text-gray-400 hover:text-white">Cars</Link></li>
              <li><Link href="/vehicles?category=motorbikes" className="text-gray-400 hover:text-white">Motorbikes</Link></li>
              <li><Link href="/vehicles?category=trucks" className="text-gray-400 hover:text-white">Trucks</Link></li>
              <li><Link href="/vehicles?category=vans" className="text-gray-400 hover:text-white">Vans</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Nairobi, Kenya</li>
              <li>info@garihubke.com</li>
              <li>+254 700 000 000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GariHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
