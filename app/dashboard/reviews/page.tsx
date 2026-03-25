import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { StarRating } from '@/components/reviews/StarRating';

export default async function MyReviewsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <div>Please log in to view your reviews.</div>;
  }

  const reviews = await db.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't written any reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{review.targetType.toLowerCase()} Review</span>
                <StarRating rating={review.rating} readonly />
              </div>
              <p className="text-sm text-gray-500">
                Target: {review.targetId}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
