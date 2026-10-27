import Link from 'next/link';
import type { Deadline, Subject } from '@/lib/types';
import { formatDate } from '@/lib/dates';
import Countdown from './Countdown';

export default function DeadlineCard({ d, subject }: { d: Deadline; subject?: Subject }) {
  return (
    <Link href={`/deadlines/${d.id}`} className="card deadline">
      <div>
        <div className="muted">{subject?.name}</div>
        <strong>{d.title}</strong>
        <div className="muted">Hạn: {formatDate(d.dueDate)}</div>
      </div>
      <Countdown dueDate={d.dueDate} />
    </Link>
  );
}
