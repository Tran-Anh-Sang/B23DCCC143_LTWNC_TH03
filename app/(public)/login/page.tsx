import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = { title: 'Đăng nhập', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  // chỉ cho phép quay lại đường dẫn nội bộ
  const safe = callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/dashboard';
  return (
    <div className="narrow">
      <h1>Đăng nhập</h1>
      <p className="muted">Tài khoản mẫu: admin@ptit.edu.vn / admin123 — sv@ptit.edu.vn / sv123456</p>
      <LoginForm callbackUrl={safe} />
    </div>
  );
}
