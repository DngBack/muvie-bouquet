# Muvie Mười Năm Tựa Một Bó Hoa

Chạy `Bat-dau-Muvie.cmd` để dùng trong Wi-Fi quán.

Đọc [phân tích và hướng dẫn vận hành](PHAN-TICH-VA-HUONG-DAN.md). Mã nguồn gồm bản hosted và bản Wi-Fi Node/SQLite, dùng chung luật chơi.

Kiểm tra: `node --test tests/game.test.mjs`. Kiểm thử máy chủ: `node tests/http-smoke.mjs`.

## Deploy lên Vercel với Supabase

1. Tạo một project trên Supabase và mở **SQL Editor**.
2. Chạy nội dung file [`supabase/schema.sql`](supabase/schema.sql) để tạo bảng `rooms`.
3. Trong **Project Settings → API**, lấy Project URL và `service_role` secret key.
4. Import repository này vào Vercel. Vercel dùng lệnh `npm run build:vercel` đã đặt trong `vercel.json`.
5. Trong **Project Settings → Environment Variables**, thêm:
   - `SUPABASE_URL`: Project URL của Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: service role secret key. Chỉ dùng ở server; không đặt tiền tố `NEXT_PUBLIC_`.
6. Redeploy trên Vercel.

API server truy cập Supabase bằng service role key; bật RLS nhưng không tạo policy cho `anon` hoặc `authenticated`, để trình duyệt không thể truy cập bảng trực tiếp. Giữ service role key trong biến môi trường Vercel, không commit vào Git.
