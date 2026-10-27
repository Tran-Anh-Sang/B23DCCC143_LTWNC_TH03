'use client';
import { useEffect, useState } from 'react';
import { daysLeft } from '@/lib/dates';

// Tính ở client sau khi mount để tránh hydration mismatch (Date.now())
export default function Countdown({ dueDate }: { dueDate: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysLeft(dueDate)), [dueDate]);
  if (days === null) return <span className="chip">…</span>;
  if (days < 0) return <span className="chip chip-late">Quá hạn {-days} ngày</span>;
  return <span className={days <= 3 ? 'chip chip-soon' : 'chip'}>{days === 0 ? 'Hạn hôm nay' : `Còn ${days} ngày`}</span>;
}
