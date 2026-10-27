export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container page">{children}</main>
      <footer className="footer container">© Class Deadline Hub — nhóm công khai, ai cũng xem được</footer>
    </>
  );
}
