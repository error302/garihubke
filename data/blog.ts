export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'news' | 'buying-guide' | 'maintenance' | 'market';
  author: string;
  publishedAt: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-choose-right-car-kenya',
    title: 'How to Choose the Right Car in Kenya',
    excerpt: 'A comprehensive guide to buying your first car in Kenya, considering budget, usage, and maintenance costs.',
    content: 'Buying a car in Kenya requires careful consideration...',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?w=800',
    category: 'buying-guide',
    author: 'GariHub Team',
    publishedAt: '2026-03-20',
  },
  {
    id: '2',
    slug: 'kenya-car-market-trends-2026',
    title: 'Kenya Car Market Trends 2026',
    excerpt: 'Latest trends in the Kenyan vehicle market, popular models, and price predictions.',
    content: 'The Kenyan automotive market is evolving rapidly...',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    category: 'market',
    author: 'GariHub Team',
    publishedAt: '2026-03-18',
  },
  {
    id: '3',
    slug: 'car-maintenance-tips-kenya',
    title: 'Essential Car Maintenance Tips for Kenyan Roads',
    excerpt: 'Keep your vehicle in top condition with these maintenance tips tailored for Kenyan conditions.',
    content: 'Kenyan roads can be tough on vehicles...',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800',
    category: 'maintenance',
    author: 'GariHub Team',
    publishedAt: '2026-03-15',
  },
  {
    id: '4',
    slug: 'suv-vs-sedan-kenya',
    title: 'SUV vs Sedan: Which is Better for Kenya?',
    excerpt: 'Compare the pros and cons of SUVs and sedans for Kenyan driving conditions.',
    content: 'When choosing a vehicle in Kenya, many buyers wonder...',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    category: 'buying-guide',
    author: 'GariHub Team',
    publishedAt: '2026-03-10',
  },
];
