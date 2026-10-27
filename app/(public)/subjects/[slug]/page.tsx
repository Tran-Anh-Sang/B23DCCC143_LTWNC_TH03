import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDeadlines, getSubject, getSubjects } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';

type Props = { params: Promise<{ slug: string }> };

// SSG: sinh sẵn mọi môn học lúc build
export async function generateStaticParams() {
  return (await getSubjects()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = await getSubject((await params).slug);
  return { title: subject?.name ?? 'Môn học' };
}

export default async function SubjectPage({ params }: Props) {
  const subject = await getSubject((await params).slug);
  if (!subject) notFound();
  const deadlines = (await getDeadlines()).filter((d) => d.subjectSlug === subject.slug);
  return (
    <>
      <h1>{subject.name}</h1>
      <p className="muted">Giảng viên: {subject.teacher}</p>
      <div className="grid">{deadlines.map((d) => <DeadlineCard key={d.id} d={d} subject={subject} />)}</div>
    </>
  );
}
