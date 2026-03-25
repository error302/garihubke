import Link from 'next/link';
import { blogPosts } from '@/data/blog';

export const metadata = {
  title: 'Blog - GariHub Vehicle News & Guides',
  description: 'Latest news, buying guides, and maintenance tips for Kenyan car buyers.',
};

const categories = [
  { value: '', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'buying-guide', label: 'Buying Guide' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'market', label: 'Market' },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">GariHub Blog</h1>
        <p className="text-gray-600">News, guides, and tips for Kenyan car buyers</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/blog?category=${cat.value}` : '/blog'}
            className="px-4 py-2 rounded-full border hover:bg-gray-50 text-sm"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-xs font-medium text-primary-600 uppercase">
                {post.category.replace('-', ' ')}
              </span>
              <h2 className="text-lg font-semibold mt-1 line-clamp-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>{post.author}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
