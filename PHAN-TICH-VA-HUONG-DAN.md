# Muvie Mười Năm Tựa Một Bó Hoa

Ứng dụng đồng hành cho một DM và sáu người chơi. Căn cứ chính là `../Translate4Test/DM book.docx`, đối chiếu thư mục `../Gốc/花束小程序内容`. App thay phần mini app trong quá trình dẫn; DM vẫn dùng kịch bản, thẻ, thư và đạo cụ giấy.

## Mở app tại quán

1. Chạy `Bat-dau-Muvie.cmd` trong thư mục này. Máy hiện tại đã có bản dựng và Node đi kèm trong `.work_dm/node-fast` ở thư mục cha.
2. Giữ cửa sổ máy chủ mở suốt lượt chơi. DM vào `http://localhost:4173`, chọn **Tôi là DM** và tạo phòng.
3. Sáu điện thoại cùng Wi-Fi truy cập địa chỉ `http://<IP máy tính>:4173` được cửa sổ máy chủ in ra. Không nhập `localhost` trên điện thoại. Chọn nhân vật đúng phân vai của DM và nhập mã tám chữ số.
4. Nếu điện thoại không vào được, kiểm tra Wi-Fi có chặn các thiết bị liên lạc với nhau hay không và Windows Firewall có cho ứng dụng Node nhận kết nối trên mạng riêng hay chưa. Chưa thay đổi cấu hình tường lửa tự động.
5. Không đóng tab của mình trong lúc chơi. Tải lại trang cùng tab sẽ khôi phục vai; đăng xuất hoặc đóng tab sẽ mất khóa vào vai đó. **Đóng máy** ngừng nhận bài và lựa chọn mới.

Ứng dụng trong Wi-Fi quán không cần tài khoản ChatGPT. Trạng thái ở SQLite trong bộ nhớ RAM và mất khi dừng máy chủ; lần chạy tiếp theo tạo phòng mới. Không cần migration hay sao lưu database.

## Các mốc đối chiếu kịch bản

| Mốc app | Vị trí trong DM Book | Thao tác |
| --- | --- | --- |
| Chờ khai máy | Chuẩn bị và màn một | Phân vai theo phiếu giấy; sáu người nhận vai |
| Những lời đồn đầu tiên | Màn hai, sau lần công bố chân ái đầu tiên và lượt đọc tiếp | Đẩy bài 1–6; giữ nguyên thông tin gây hiểu nhầm |
| Ghi hình chương trình | Màn ba, sau Hoán Đổi Linh Hồn | Đẩy bài 7–9 và mở lượt cảm nghĩ 1 |
| Hành trình chân ái | Màn ba | Quỹ, phương tiện, chỗ ở, ăn uống, vui chơi, mua nhanh |
| Cùng nhau du lịch | Màn ba, sau lễ cưới thử | DM đăng ảnh, người chơi viết cảm nghĩ 2 |
| Lời hẹn ba năm | Màn bốn | Đẩy bài 10–21; dùng thẻ Bạn nói tôi đoán; cuối màn viết cảm nghĩ 3 |
| Lời hẹn năm năm | Màn năm | Không có bài tự động mới; dùng đạo cụ giấy, lời trao huy chương |
| Lời hẹn bảy năm | Màn sáu | Tiểu Mạnh; thư chia tay, lời nhắn và lời cầu hôn |
| Một bó hoa để nhớ | Cuối màn bảy | Sau phát cuốn kết cục và tổng kết, mở kỷ niệm |

Mốc ba năm hiện mở quyền viết ngay cùng bảng tin. DM nhắc người chơi chỉ viết ở cuối màn, đúng lời thoại. Các nội dung mở không bị khóa lại khi chuyển mốc; mỗi người chỉ đăng một bài trong mỗi lượt, nên DM chỉ chuyển khi đã đủ sáu bài. Các mốc phải mở tuần tự. Sau hành trình phải tính xong đủ năm vòng mới chuyển tiếp.

## Luật hành trình

- Quỹ chung **100.000 điểm / cặp**, giữ nguyên tỷ lệ số tiền trong nguồn; không quy đổi sang VND.
- Lâm Vũ – Lý Trạch Viễn đi Mỹ; Diệp Tiêu Tiêu – Tống Bạc Giản đi Hàn Quốc; Ôn Ấu Vi – Kiều Dã đi Anh. Các cặp chỉ cần được biết sau màn hoán đổi; không giới thiệu quan hệ thật cho người chơi ở màn hai.
- Ba vòng đầu chọn một phương án. Hai người trùng lựa chọn thì chi phí cặp là 0. Khác lựa chọn thì cộng giá của hai phương án.
- Vui chơi chọn 1–9 mục. Những mục chung được tài trợ; chỉ cộng giá những mục chỉ một người chọn. Danh sách mẫu có 10 mục.
- Mua sắm: DM cho đọc danh sách trước, sau đó bấm bắt đầu. Mỗi thiết bị có 10 giây tính từ lần máy chủ ghi nhận người chơi mở vòng. Có thể mua nhiều món, mỗi món một lần. Người chơi có thể nộp sớm; hết giờ app tự nộp. Sau mất mạng, mở lại app và chờ đồng bộ để nộp phần đã mua. DM đợi đủ 6/6 rồi tính phí.
- Tiền được tính trên máy chủ, không tin vào tổng do trình duyệt gửi. Cần đủ sáu lựa chọn, chỉ tính mỗi vòng một lần. Chọn trùng ở vòng nhiều lựa chọn và mua sắm cũng được tài trợ.
- Cặp có số dư **dương nhỏ nhất** thắng. Nếu tất cả âm, nợ ít nhất thắng. Bằng điểm thì đồng hạng. Số dư 0 được đặt sau số dương; nguồn không giải thích riêng trường hợp đúng 0, nên đây là quy ước của bản ứng dụng.
- DM có thể chỉnh quỹ với lý do, được ghi nhật ký. Không tự thêm chức năng chia sẻ WeChat để nhận tiền, bởi không có quy tắc thưởng cụ thể trong nguồn ảnh. DM có thể cộng tài trợ thật của buổi chơi bằng phần điều chỉnh.

## Nội dung và nhận diện

Nội dung bảng tin được Việt hóa từ ảnh, dùng tên trong bản dịch DM Book. Bài 10–21 được khử trùng giữa bảy ảnh chụp màn hình, giữ mảnh QR và những hình gắn với lời hẹn, phim, thi đấu. Chưa dùng số lượt thích hoặc bình luận giả trong ảnh; lượt thích trong app là tương tác thật của bàn chơi. Chưa triển khai bình luận vì kịch bản không yêu cầu thao tác đó.

Kỷ niệm là ba bài do chính mỗi người viết, tên vai và ảnh DM tải lên. Đây là poster HTML tiếng Việt có thể in/lưu PDF hoặc tải về, không lấy ảnh kết cục tiếng Trung làm nội dung tiếng Việt. Cuốn kết cục giấy vẫn là nội dung kết cục chính thức. Những câu lời thề, diễn xuất, bệnh lý, chia tay và thư vẫn đọc theo sách, app không viết lại chúng thành luật.

Màu đỏ rượu `#7b3040`, nền kem `#f8f4ed`, điểm nhấn giấy kraft và xanh lá trầm là phương án thiết kế tạm theo không khí Muvie và chủ đề bó hoa. Nguồn hiện chưa có bảng màu hoặc logo Muvie chính thức; biểu tượng hoa và chữ Muvie trong app là phần dựng mới, không tuyên bố là logo chuẩn.

Ba MP3 được giữ nguyên: lời cầu hôn Lý Trạch Viễn, cụ Mạnh nam và nữ. Tất cả là tiếng Trung và được ghi rõ trong giao diện. DM chọn file tiếng Việt hoặc BGM từ máy nếu đã có. File tự chọn phát trong phiên hiện tại, không tải lên máy chủ. Âm thanh chỉ phát trên thiết bị DM, không đồng loạt phát trên sáu điện thoại.

Giá phương tiện, ăn uống, vui chơi và phần lớn chỗ ở được chép từ ảnh. Một số hàng cuối danh sách bị che bởi khung tổng tiền: mục cắm trại được đọc từ ảnh kéo xuống; sản phẩm piano và dây chuyền đọc từ màn hình mua sắm tiếp theo. Bộ ảnh chỉ cho thấy một bộ lựa chọn; app dùng cùng danh sách giá cho ba điểm đến. Cần đối chiếu với mini app được cấp quyền nếu muốn xác nhận tuyệt đối toàn bộ tùy chọn gốc.

## Kỹ thuật và kiểm tra

- Bản Vercel: Next.js API và Supabase Postgres qua Data REST API. Trạng thái phòng hết hạn sau 24 giờ từ thao tác cuối; Supabase Cron dọn phòng hết hạn mỗi 15 phút. API cập nhật có điều kiện version để tránh mất lựa chọn khi nhiều điện thoại ghi cùng lúc.
- Bản Wi-Fi: cùng giao diện và cùng bộ luật, Node HTTP và SQLite trong RAM; trạng thái mất khi dừng máy chủ. Bản Wi-Fi không cần cài dependency sau khi đã dựng.
- Vai DM và người chơi dùng khóa ngẫu nhiên. API lọc khóa của người khác và đáp án chưa công bố. Bảng tin chỉ được gửi đến client sau khi mở mốc.
- Kiểm thử bộ luật ở `tests/game.test.mjs`. Kiểm thử HTTP trọn lượt ở `tests/http-smoke.mjs`.
- Mã nguồn giao diện: `app/page.tsx`, `app/globals.css`, `app/mobile.css`. Luật: `lib/engine.mjs`. Nội dung: `lib/game-data.mjs`, `lib/story.mjs`.
- Thay màu chính ở biến `:root` trong `app/globals.css`.

Máy khác cần Node 22.13 trở lên. Dựng lại bản Wi-Fi bằng `node node_modules/vite/bin/vite.js build --config vite.local.config.ts`; chạy `node local/server.mjs`. Đặt `HOST=0.0.0.0` khi cần điện thoại truy cập. Mặc định server chỉ nghe loopback để kiểm tra trên máy.

Để chạy bản Vercel cho khách bên ngoài Wi-Fi, tạo project Supabase, chạy `supabase/schema.sql`, rồi đặt `SUPABASE_URL` và `SUPABASE_SECRET_KEY` trong Vercel. Bản Wi-Fi xóa trạng thái khi dừng tiến trình.
