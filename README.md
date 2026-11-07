# Muvie Mười Năm Tựa Một Bó Hoa

Chạy `Bat-dau-Muvie.cmd` để dùng trong Wi-Fi quán.

Đọc [phân tích và hướng dẫn vận hành](PHAN-TICH-VA-HUONG-DAN.md). Mã nguồn gồm bản hosted và bản Wi-Fi Node/SQLite, dùng chung luật chơi.

Kiểm tra: `node --test tests/game.test.mjs`. Kiểm thử máy chủ: `node tests/http-smoke.mjs`.

## Deploy Vercel: phòng chỉ giữ tạm

Mỗi phòng dùng Upstash Redis làm bộ nhớ tạm để DM và sáu người chơi đồng bộ qua nhiều điện thoại. Serverless Vercel không thể chia sẻ RAM của một tiến trình cho tất cả người chơi. Phòng tự hết hạn sau khi chơi xong; không cần tạo bảng hay cơ sở dữ liệu SQL.

1. Tạo database **Upstash Redis** từ [Upstash Console](https://console.upstash.com/) hoặc Vercel Marketplace.
2. Lấy REST URL và REST token trong trang thông tin database.
3. Import repo `DngBack/muvie-bouquet` vào Vercel. `vercel.json` đã chọn Next.js và lệnh build.
4. Trong Vercel **Project Settings → Environment Variables**, thêm:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. Deploy; không cần chạy migration hay tạo bảng.

Phòng tự hết hạn sau **24 giờ kể từ hoạt động cuối**. Các tab đang mở làm mới hạn khi đồng bộ. Reload cùng tab vẫn vào lại vai hiện tại; đóng tab thì không có file khôi phục.

## Chơi trên điện thoại

DM tạo phòng rồi gửi link `...?phong=12345678` cho người chơi. Mỗi người mở link bằng Safari/Chrome, nhập tên và chọn vai được DM phân. Giao diện có thanh điều hướng dưới màn hình, vùng chạm rộng, chữ và nút dễ đọc hơn, bàn phím số cho mã phòng, cùng khoảng an toàn quanh tai thỏ/thanh home.

Upstash REST API nhận Redis command qua POST và hỗ trợ script Lua cho ghi có kiểm tra phiên bản; cách này dùng để đồng bộ trạng thái giữa các Vercel function instance. [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
