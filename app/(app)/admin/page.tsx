import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/data';
import { formatDate } from '@/lib/dates';
import { addDeadlineAction, deleteDeadlineAction } from '@/app/actions';

export const metadata: Metadata = { title: 'Quản trị', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic'; // SSR

export default async function AdminPage() {
  // Lớp 2: tự kiểm tra quyền, không chỉ tin Middleware
  const session = await auth();
  if (!session) redirect('/login?callbackUrl=/admin');
  if (!can(session.user.role, 'deadline:create')) redirect('/403');

  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return (
    <>
      <h1>Quản trị deadline</h1>
      <form action={addDeadlineAction} className="card form">
        <h2>Thêm deadline</h2>
        <label>Môn học
          <select name="subjectSlug" required>{subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
        </label>
        <label>Tiêu đề<input name="title" required minLength={3} maxLength={120} /></label>
        <label>Mô tả<textarea name="description" maxLength={500} /></label>
        <label>Hạn nộp<input name="dueDate" type="datetime-local" required /></label>
        <button className="btn">Thêm</button>
      </form>
      <h2>Danh sách ({deadlines.length})</h2>
      <div className="grid">
        {deadlines.map((d) => (
          <div key={d.id} className="card deadline">
            <div>
              <strong>{d.title}</strong>
              <div className="muted">Hạn: {formatDate(d.dueDate)}</div>
            </div>
            <form action={deleteDeadlineAction}>
              <input type="hidden" name="id" value={d.id} />
              <button className="btn btn-danger">Xoá</button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
