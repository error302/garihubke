import Link from 'next/link';

interface DealerCardProps {
  dealer: {
    id: string;
    name: string;
    logo?: string | null;
    city?: string | null;
    isVerified: boolean;
  };
}

export default function DealerCard({ dealer }: DealerCardProps) {
  return (
    <Link href={`/dealers/${dealer.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          {dealer.logo ? (
            <img src={dealer.logo} alt={dealer.name} className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">{dealer.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">
              {dealer.name}
              {dealer.isVerified && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Verified</span>}
            </h3>
            {dealer.city && <p className="text-gray-500">{dealer.city}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
