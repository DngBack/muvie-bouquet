# Muvie Mười Năm Tựa Một Bó Hoa

Ứng dụng web cho một DM và sáu người chơi. Có thể triển khai lên Vercel và mở bằng link trên máy tính hoặc điện thoại.

## Triển khai Vercel + Supabase

1. Tạo project Supabase.
2. Mở **SQL Editor**, chạy toàn bộ [`supabase/schema.sql`](supabase/schema.sql). Script tạo bảng phòng, bật RLS và đặt lịch xóa phòng hết hạn mỗi 15 phút bằng Supabase Cron.
3. Trong Supabase **Project Settings → API Keys**, sao chép Project URL và Secret key (`sb_secret_...`). Không dùng publishable key ở đây.
4. Import `DngBack/muvie-bouquet` vào Vercel. Framework và lệnh build đã có trong `vercel.json`.
5. Trong Vercel **Project Settings → Environment Variables**, thêm:
   - `SUPABASE_URL`: Project URL.
   - `SUPABASE_SECRET_KEY`: Secret key của Supabase.
6. Deploy hoặc redeploy.

Secret key chỉ được gửi từ API server tới Supabase; không đặt trong mã trình duyệt, không thêm tiền tố `NEXT_PUBLIC_`, và không commit giá trị thật vào Git. Bảng `rooms` không có policy cho trình duyệt; API server là nơi duy nhất dùng key có quyền ghi.

## Cách chơi

1. DM mở link Vercel, chọn **Tôi là DM** rồi tạo phòng.
2. DM sao chép link mời có mã phòng và gửi vào nhóm chat.
3. Sáu người mở link trên Safari/Chrome điện thoại, nhập tên và chọn đúng vai DM phân.
4. DM dẫn trò chơi; các thiết bị đồng bộ tiến trình tự động. Không cài ứng dụng.

Phòng hết hạn sau 24 giờ kể từ thao tác chơi gần nhất. Supabase Cron xóa phòng hết hạn mỗi 15 phút. Reload cùng tab vẫn giữ vai hiện tại; đóng tab hoặc đăng xuất sẽ xóa vé của thiết bị đó. Sau khi kết thúc, người chơi có thể tải kỷ niệm HTML/PDF trước khi phòng bị xóa.

## Chạy tại quán qua Wi-Fi

Chạy `Bat-dau-Muvie.cmd`, giữ cửa sổ server mở, rồi cho điện thoại truy cập địa chỉ LAN mà server in ra. Bản Wi-Fi giữ trạng thái trong RAM và xóa khi dừng server.

## Tài liệu dự án

- [Phân tích và hướng dẫn vận hành](PHAN-TICH-VA-HUONG-DAN.md)
- Kiểm tra luật: `node --test tests/game.test.mjs`
- Kiểm thử HTTP: `node tests/http-smoke.mjs`
