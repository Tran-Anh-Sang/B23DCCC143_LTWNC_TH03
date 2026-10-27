import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';

// next/font/local (tự host): 2 tập glyph Latin + Tiếng Việt của Be Vietnam Pro
const latin = localFont({
  src: [
    { path: './fonts/be-vietnam-pro-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/be-vietnam-pro-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/be-vietnam-pro-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--f-latin',
  display: 'swap',
});
const viet = localFont({
  src: [
    { path: './fonts/be-vietnam-pro-vietnamese-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/be-vietnam-pro-vietnamese-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/be-vietnam-pro-vietnamese-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--f-vi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Class Deadline Hub', template: '%s | Class Deadline Hub' },
  description: 'Cổng theo dõi deadline của lớp: xem công khai, đăng nhập để đánh dấu đã xong.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${latin.variable} ${viet.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
