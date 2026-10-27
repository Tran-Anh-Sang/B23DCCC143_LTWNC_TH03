'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import NavLink from './NavLink';

const ROLE_LABEL = { admin: 'Admin', user: 'User' } as const;

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="header">
      <div className="container header-in">
        <Link href="/" className="brand">Class Deadline Hub</Link>
        <nav className="nav">
          <NavLink href="/deadlines">Deadline</NavLink>
          {session && <NavLink href="/dashboard">Dashboard</NavLink>}
          {session?.user.role === 'admin' && <NavLink href="/admin">Quản trị</NavLink>}
        </nav>
        <div className="userbox">
          {status === 'loading' ? null : session ? (
            <>
              <span>
                {session.user.name} <span className="badge">{ROLE_LABEL[session.user.role]}</span>
              </span>
              <button className="btn btn-outline" onClick={() => signOut({ redirectTo: '/' })}>Đăng xuất</button>
            </>
          ) : (
            <Link href="/login" className="btn">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
