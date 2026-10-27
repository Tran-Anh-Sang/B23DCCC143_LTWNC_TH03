import { ImageResponse } from 'next/og';
import { getDeadline, getSubject } from '@/lib/data';
import { formatDate } from '@/lib/dates';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Deadline của lớp';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const d = await getDeadline((await params).id);
  const subject = d ? await getSubject(d.subjectSlug) : undefined;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff', borderLeft: '40px solid #f97316', padding: 70 }}>
        <div style={{ fontSize: 34, color: '#f97316', display: 'flex' }}>Class Deadline Hub</div>
        <div style={{ fontSize: 68, fontWeight: 700, color: '#1f2937', marginTop: 20, display: 'flex' }}>{d?.title ?? 'Deadline'}</div>
        <div style={{ fontSize: 36, color: '#6b7280', marginTop: 24, display: 'flex' }}>{subject?.name}</div>
        <div style={{ fontSize: 40, color: '#ea580c', marginTop: 16, display: 'flex' }}>Hạn: {d ? formatDate(d.dueDate) : ''}</div>
      </div>
    ),
    size,
  );
}
