import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlineList from '@/components/DeadlineList';

export const metadata: Metadata = { title: 'Tất cả deadline' };
// ISR: làm mới nền sau tối đa 60 giây
export const revalidate = 60;

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return (
    <>
      <h1>Tất cả deadline</h1>
      <DeadlineList deadlines={deadlines} subjects={subjects} />
    </>
  );
}
