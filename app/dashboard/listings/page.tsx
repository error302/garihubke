import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ListingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const listings = await db.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          href="/sell"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven&apos;t listed any vehicles yet.</p>
          <Link
            href="/sell"
            className="text-primary-600 hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                {listing.images && JSON.parse(listing.images).length > 0 ? (
                  <img 
                    src={JSON.parse(listing.images)[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{listing.title}</h3>
                <p className="text-gray-600">KSh {listing.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                    listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
