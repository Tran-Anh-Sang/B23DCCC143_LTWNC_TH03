import Image from 'next/image';
import Link from 'next/link';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';

// SSG: sinh sẵn lúc build
export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const upcoming = deadlines.filter((d) => new Date(d.dueDate) >= new Date()).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div>
          <h1>Không lỡ deadline nào của lớp</h1>
          <p>Xem deadline công khai, đăng nhập để đánh dấu đã xong. Lớp trưởng cập nhật ngay trên hệ thống.</p>
          <Link href="/deadlines" className="btn">Xem tất cả deadline</Link>
        </div>
        <Image src="/hero.png" alt="Lịch deadline của lớp" width={600} height={300} priority className="hero-img" />
      </section>
      <h2>Các môn học</h2>
      <div className="grid">
        {subjects.map((s) => (
          <Link key={s.slug} href={`/subjects/${s.slug}`} className="card">
            <strong>{s.name}</strong>
            <div className="muted">GV: {s.teacher}</div>
          </Link>
        ))}
      </div>
      <h2>Sắp đến hạn</h2>
      <div className="grid">{upcoming.map((d) => <DeadlineCard key={d.id} d={d} subject={subjects.find((s) => s.slug === d.subjectSlug)} />)}</div>
    </>
  );
}
