import NavLink from '@/components/NavLink';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="with-sidebar">
      <aside className="sidebar">
        <NavLink href="/dashboard" exact>Tổng quan</NavLink>
        <NavLink href="/dashboard/done">Đã hoàn thành</NavLink>
        <NavLink href="/deadlines">Tất cả deadline</NavLink>
      </aside>
      <section>{children}</section>
    </div>
  );
}
