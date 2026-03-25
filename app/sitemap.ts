import { MetadataRoute } from 'next';
import { vehicles } from '@/data/vehicles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://garihub.co.ke';

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/vehicles',
    '/vehicles/map',
    '/dealers',
    '/calculator',
    '/pricing',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/sell',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  const vehiclePages = vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicles/${vehicle.id}`,
    lastModified: new Date(vehicle.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dealerIds = Array.from(new Set(vehicles.map(v => v.seller.name))).slice(0, 10);
  const dealerPages = dealerIds.map((name) => ({
    url: `${baseUrl}/dealers/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...vehiclePages, ...dealerPages];
}
