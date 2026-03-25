import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} - GariHub Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/blog" className="text-primary-600 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
      />
      
      <span className="text-sm font-medium text-primary-600 uppercase">
        {post.category.replace('-', ' ')}
      </span>
      
      <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{post.title}</h1>
      
      <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
        <span>By {post.author}</span>
        <span>•</span>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      
      <div className="mt-8 pt-8 border-t">
        <Link href="/blog" className="text-primary-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
