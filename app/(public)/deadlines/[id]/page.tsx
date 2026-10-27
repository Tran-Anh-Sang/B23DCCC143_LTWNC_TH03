import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDeadline, getDeadlines, getSubject } from '@/lib/data';
import { formatDate } from '@/lib/dates';
import Countdown from '@/components/Countdown';

type Props = { params: Promise<{ id: string }> };

// ISR: sinh sẵn lúc build; admin thêm/xoá -> revalidatePath làm mới ngay (xem app/actions.ts)
export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDeadline((await params).id);
  if (!d) return { title: 'Không tìm thấy deadline' };
  const subject = await getSubject(d.subjectSlug);
  const description = `${subject?.name}: ${d.title} — hạn ${formatDate(d.dueDate)}. ${d.description}`;
  return {
    title: d.title,
    description,
    alternates: { canonical: `/deadlines/${d.id}` },
    openGraph: { title: d.title, description, type: 'article' }, // ảnh lấy từ opengraph-image.tsx
  };
}

export default async function DeadlineDetail({ params }: Props) {
  const { id } = await params;
  const d = await getDeadline(id);
  if (!d) notFound();
  const subject = await getSubject(d.subjectSlug);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: base },
      { '@type': 'ListItem', position: 2, name: 'Deadline', item: `${base}/deadlines` },
      { '@type': 'ListItem', position: 3, name: d.title, item: `${base}/deadlines/${d.id}` },
    ],
  };
  return (
    <article className="card detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="muted"><Link href="/">Trang chủ</Link> › <Link href="/deadlines">Deadline</Link> › {d.title}</nav>
      <h1>{d.title}</h1>
      <p><Link href={`/subjects/${d.subjectSlug}`}>{subject?.name}</Link></p>
      <p>{d.description}</p>
      <p>Hạn nộp: <strong>{formatDate(d.dueDate)}</strong> <Countdown dueDate={d.dueDate} /></p>
      <p className="muted">Đăng nhập tại <Link href="/login">đây</Link> để đánh dấu đã xong.</p>
    </article>
  );
}
