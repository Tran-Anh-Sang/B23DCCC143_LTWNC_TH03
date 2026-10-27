import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container page center">
      <h1>404 — Không tìm thấy trang</h1>
      <p className="muted">Deadline hoặc trang bạn tìm không tồn tại.</p>
      <Link href="/deadlines" className="btn">Xem danh sách deadline</Link>
    </div>
  );
}
