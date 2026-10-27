'use client';
import { useState } from 'react';
import type { Deadline, Subject } from '@/lib/types';
import DeadlineCard from './DeadlineCard';

// Bộ lọc theo môn: cần state -> Client Component
export default function DeadlineList({ deadlines, subjects }: { deadlines: Deadline[]; subjects: Subject[] }) {
  const [slug, setSlug] = useState('all');
  const shown = slug === 'all' ? deadlines : deadlines.filter((d) => d.subjectSlug === slug);
  return (
    <>
      <div className="filters">
        <button className={slug === 'all' ? 'pill active' : 'pill'} onClick={() => setSlug('all')}>Tất cả</button>
        {subjects.map((s) => (
          <button key={s.slug} className={slug === s.slug ? 'pill active' : 'pill'} onClick={() => setSlug(s.slug)}>{s.name}</button>
        ))}
      </div>
      <div className="grid">
        {shown.map((d) => <DeadlineCard key={d.id} d={d} subject={subjects.find((s) => s.slug === d.subjectSlug)} />)}
        {shown.length === 0 && <p className="muted">Không có deadline nào.</p>}
      </div>
    </>
  );
}
