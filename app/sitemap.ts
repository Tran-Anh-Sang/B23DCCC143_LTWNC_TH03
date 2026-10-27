import type { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return [
    { url: base },
    { url: `${base}/deadlines` },
    ...subjects.map((s) => ({ url: `${base}/subjects/${s.slug}` })),
    ...deadlines.map((d) => ({ url: `${base}/deadlines/${d.id}` })),
  ];
}
