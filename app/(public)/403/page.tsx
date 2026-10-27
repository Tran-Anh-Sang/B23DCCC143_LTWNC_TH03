import Link from 'next/link';
export const metadata = { title: '403 — Không có quyền', robots: { index: false } };

export default function Forbidden() {
  return (
    <div className="center">
      <h1>403 — Không có quyền truy cập</h1>
      <p className="muted">Trang này chỉ dành cho lớp trưởng (admin).</p>
      <Link href="/dashboard" className="btn">Về Dashboard</Link>
    </div>
  );
}
