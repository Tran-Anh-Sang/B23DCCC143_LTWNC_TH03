'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const f = new FormData(e.currentTarget);
    const res = await signIn('credentials', { email: f.get('email'), password: f.get('password'), redirect: false });
    if (res?.error) {
      setError('Email hoặc mật khẩu không đúng');
      setPending(false);
    } else {
      window.location.href = callbackUrl;
    }
  }

  return (
    <form onSubmit={onSubmit} className="card form">
      <label>Email<input name="email" type="email" required defaultValue="sv@ptit.edu.vn" /></label>
      <label>Mật khẩu<input name="password" type="password" required /></label>
      {error && <p role="alert" className="error">{error}</p>}
      <button className="btn" disabled={pending}>{pending ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
    </form>
  );
}
