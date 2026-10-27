import type { Metadata } from 'next';
import { auth } from '@/auth';
import { getDeadlines, getDoneIds, getSubjects } from '@/lib/data';
import { formatDate } from '@/lib/dates';
import { toggleDoneAction } from '@/app/actions';
import Countdown from '@/components/Countdown';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic'; // SSR: render mỗi request

export default async function DashboardPage() {
  const session = await auth();
  const [deadlines, subjects, done] = await Promise.all([getDeadlines(), getSubjects(), getDoneIds(session!.user.id)]);
  const todo = deadlines.filter((d) => !done.includes(d.id));
  const now = Date.now();
  const overdue = todo.filter((d) => new Date(d.dueDate).getTime() < now).length;
  const soon = todo.filter((d) => { const t = new Date(d.dueDate).getTime(); return t >= now && t - now <= 7 * 86_400_000; }).length;
  return (
    <>
      <h1 className="page-title">Xin chào, {session!.user.name} 👋</h1>
      <div className="stats">
        <div className="stat"><b>{todo.length}</b><span>Chưa xong</span></div>
        <div className="stat stat-warn"><b>{soon}</b><span>Hạn trong 7 ngày</span></div>
        <div className="stat stat-late"><b>{overdue}</b><span>Quá hạn</span></div>
        <div className="stat stat-ok"><b>{done.length}</b><span>Đã xong</span></div>
      </div>
      <h2 className="section-title">Cần làm</h2>
      <ul className="rows">
        {todo.map((d) => (
          <li key={d.id} className="row">
            <div className="row-main">
              <span className="tag">{subjects.find((s) => s.slug === d.subjectSlug)?.name}</span>
              <strong>{d.title}</strong>
              <span className="muted">Hạn: {formatDate(d.dueDate)}</span>
            </div>
            <Countdown dueDate={d.dueDate} />
            <form action={toggleDoneAction}>
              <input type="hidden" name="id" value={d.id} />
              <button className="btn btn-sm">✓ Đã xong</button>
            </form>
          </li>
        ))}
        {todo.length === 0 && <li className="muted">🎉 Bạn đã hoàn thành tất cả deadline!</li>}
      </ul>
    </>
  );
}
