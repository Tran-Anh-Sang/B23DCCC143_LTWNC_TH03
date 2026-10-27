import type { NextAuthConfig } from 'next-auth';

// Cấu hình nhẹ, an toàn cho Edge Runtime (dùng trong middleware)
export default {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as 'admin' | 'user';
      return session;
    },
  },
} satisfies NextAuthConfig;
