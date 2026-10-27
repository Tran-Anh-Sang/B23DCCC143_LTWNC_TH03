# Class Deadline Hub

Cổng web deadline của lớp (Next.js 15 App Router + TypeScript + NextAuth/Auth.js v5). Giao diện tông **trắng – cam**.

## Cách chạy

```bash
npm install
cp .env.example .env.local     # đổi AUTH_SECRET bằng: npx auth secret
npm run dev                    # phát triển: http://localhost:3000
npm run build && npm start
npm test                       # test Jest cho can() (điểm cộng)
```

Tài khoản mẫu: `admin@ptit.edu.vn / admin123` (admin) · `sv@ptit.edu.vn / sv123456` (user).
Dữ liệu là file JSON phía server trong `data/` (4 môn, 12 deadline). Lưu ý: ghi file JSON chỉ chạy trên Node server/máy local, không ghi được trên Vercel (hệ thống file chỉ đọc).

## Cấu trúc chính

```
app/(public)/   /, /subjects/[slug], /deadlines, /deadlines/[id], /login, /403   (layout công khai)
app/(app)/      /dashboard (+ sidebar lồng nhau), /dashboard/done, /admin         (layout riêng)
app/actions.ts  Server Actions: đánh dấu xong, thêm, xoá (kiểm tra phiên + quyền + zod)
lib/permissions.ts  Ma trận phân quyền duy nhất + hàm can(role, action)
auth.config.ts / auth.ts / middleware.ts / types/next-auth.d.ts
```

## Chiến lược render (kết quả `npm run build`)

![build](docs/build-output.png)

| Route | Chiến lược | Lý do |
|---|---|---|
| `/` | SSG | Nội dung chung, ít đổi → sinh sẵn lúc build, phục vụ nhanh nhất |
| `/subjects/[slug]` | SSG | Chỉ 4 môn, biết trước → `generateStaticParams` |
| `/deadlines` | ISR (`revalidate = 60`) | Danh sách công khai, cần SEO, chấp nhận cũ tối đa 60 giây |
| `/deadlines/[id]` | ISR (`generateStaticParams` + `revalidatePath` khi thêm/xoá) | Nhiều trang, đổi không thường xuyên, cần SEO; admin thao tác là làm mới ngay |
| `/dashboard` | SSR (`force-dynamic`) | Phụ thuộc từng người dùng (tiến độ đã xong) |
| `/admin` | SSR (`force-dynamic`) | Phụ thuộc vai trò, dữ liệu quản trị luôn mới |

Header dùng `useSession` (Client Component) để các trang SSG/ISR không bị chuyển thành dynamic vì đọc cookie. `'use client'` chỉ dùng cho: Header, NavLink, Countdown (đếm ngược), DeadlineList (bộ lọc), LoginForm, ResetButton.

## Lighthouse (bản production, `npm run build && npm start`)

| Trang | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 76 | 100 | 96 | 100 | 0.9 s | 3.5 s | 540 ms | 0 |
| `/deadlines/1` | 87 | 95 | 96 | 100 | 0.8 s | 3.0 s | 320 ms | 0 |

Đo bằng Lighthouse CLI (headless, mô phỏng mobile) trong môi trường cloud nên điểm Performance có thể khác khi đo trên máy bạn; báo cáo JSON ở `docs/lighthouse-*.json`. Khuyến nghị đo lại bằng Chrome DevTools và chụp ảnh thay thế.

## View-source của `/deadlines/1`

![view-source](docs/view-source-deadlines-1.png)

Thẻ `<title>`, `description`, `canonical`, Open Graph (kèm `og:image` động) và JSON-LD `BreadcrumbList` đều có sẵn trong HTML server trả về.

## Trả lời câu hỏi

**(1) Vì sao `/deadlines/[id]` dùng ISR?**
Trang chi tiết là nội dung công khai, cần SEO và ảnh xem trước nên phải có HTML sẵn → tĩnh (nhanh, phục vụ từ cache/CDN). Nhưng deadline có thể bị admin thêm/xoá, nên SSG thuần sẽ bị cũ đến lần build sau, còn SSR thì tốn server cho mỗi lượt xem. ISR kết hợp cả hai: trang tĩnh, được làm mới ngay bằng `revalidatePath` khi admin thêm/xoá; id mới chưa có lúc build vẫn được render theo yêu cầu rồi cache.

**(2) Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?**
Middleware chỉ là một lớp chặn sớm, kiểm tra thô và dễ sai: matcher cấu hình thiếu/sai sẽ bỏ sót route; từng có lỗ hổng bỏ qua Middleware ở một số phiên bản Next.js; và Middleware không bảo vệ Server Action — vốn là endpoint công khai, ai biết đường dẫn đều có thể gọi trực tiếp (thêm/xoá deadline) mà không qua trang `/admin`. Vì vậy dự án kiểm tra quyền nhiều lớp: Middleware → trang `/admin` (`auth()` + `can()`) → mọi Server Action (kiểm tra phiên, quyền, và validate bằng zod).

## Điểm cộng đã làm
- Test Jest cho `can()` (`lib/permissions.test.ts`, chạy `npm test`).
- Chưa làm: đăng nhập GitHub (OAuth), deploy Vercel.
