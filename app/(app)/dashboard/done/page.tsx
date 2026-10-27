import type { Metadata } from 'next';
import { auth } from '@/auth';
import { getDeadlines, getDoneIds } from '@/lib/data';
import { formatDate } from '@/lib/dates';
import { toggleDoneAction } from '@/app/actions';

export const metadata: Metadata = { title: 'Đã hoàn thành', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DonePage() {
  const session = await auth();
  const done = await getDoneIds(session!.user.id);
  const list = (await getDeadlines()).filter((d) => done.includes(d.id));
  return (
    <>
      <h1 className="page-title">Đã hoàn thành</h1>
      {list.length === 0 && <p className="muted">Bạn chưa hoàn thành deadline nào.</p>}
      <ul className="rows">
        {list.map((d) => (
          <li key={d.id} className="row">
            <div className="row-main">
              <strong>✅ {d.title}</strong>
              <span className="muted">Hạn: {formatDate(d.dueDate)}</span>
            </div>
            <form action={toggleDoneAction}>
              <input type="hidden" name="id" value={d.id} />
              <button className="btn btn-outline btn-sm">Bỏ đánh dấu</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
