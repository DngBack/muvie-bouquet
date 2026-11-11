export const roles = [
 {id:'lam-vu',name:'Lâm Vũ',trueName:'Lâm Vũ',portrait:'/avatars/lin-vu.webp',truePortrait:'/avatars/lin-vu.webp',tag:'Chim Nhỏ',pair:0,color:'#758377'},
 // Seat ids keep the fake identity assigned at the beginning. Their real identities are revealed at stage 2.
 {id:'ly-trach-vien',name:'Lý Trạch Viễn',trueName:'Tống Bạc Giản',portrait:'/avatars/ly-trach-vien.webp',truePortrait:'/avatars/tong-bac-gian.webp',tag:'Người giữ lời hẹn',pair:1,color:'#9c7458'},
 {id:'diep-tieu-tieu',name:'Diệp Tiêu Tiêu',trueName:'Diệp Tiêu Tiêu',portrait:'/avatars/diep-tieu-tieu.webp',truePortrait:'/avatars/diep-tieu-tieu.webp',tag:'Don Quixote',pair:1,color:'#b16d65'},
 {id:'tong-bac-gian',name:'Tống Bạc Giản',trueName:'Kiều Dã',portrait:'/avatars/tong-bac-gian.webp',truePortrait:'/avatars/kieu-da.webp',tag:'Giỏi Thứ Hai Thế Giới',pair:2,color:'#778194'},
 {id:'on-au-vi',name:'Ôn Ấu Vi',trueName:'Ôn Ấu Vi',portrait:'/avatars/on-au-vi.webp',truePortrait:'/avatars/on-au-vi.webp',tag:'Một thời thanh xuân',pair:2,color:'#a28b56'},
 {id:'kieu-da',name:'Kiều Dã',trueName:'Lý Trạch Viễn',portrait:'/avatars/kieu-da.webp',truePortrait:'/avatars/ly-trach-vien.webp',tag:'Chàng trai sân cỏ',pair:0,color:'#667d81'}
];
export const pairs=['Lâm Vũ & Lý Trạch Viễn','Diệp Tiêu Tiêu & Tống Bạc Giản','Ôn Ấu Vi & Kiều Dã'];
export const displayName=(role,stage=0)=>stage>=2?(role?.trueName||role?.name):role?.name;
export const destinations=['Mỹ','Hàn Quốc','Anh'];
export const rounds=['Phương tiện di chuyển','Khách sạn & chỗ ở','Ẩm thực','Hoạt động vui chơi','Mua sắm điên cuồng'];
// Giá giữ theo số đọc được trong ảnh mẫu, tiền là đơn vị hư cấu trong trò chơi.
export const catalog=[
 [['Máy bay hạng nhất',55809,'Một chỗ ngồi rộng, một hành trình êm ái.'],['Máy bay phổ thông',13860,'Sát bên mây trời, đi đến nơi mình mong.'],['Du thuyền hạng nhất',34791,'Có biển đồng hành suốt chuyến đi.'],['Tàu thủy phổ thông',8453,'Một chuyến đi dài, đầy những câu chuyện.']],
 [['Khách sạn thị trấn ven biển',5081,'Thức dậy cùng tiếng sóng.'],['Khách sạn chủ đề cao bồi',4011,'Một chút miền Tây và những điều bất ngờ.'],['Khu nghỉ dưỡng nông trại',3654,'Một khoảng xanh bình yên.'],['Khách sạn bờ biển',3124,'Cửa sổ mở ra phía đại dương.'],['Giường tầng khu lưu trú',879,'Đông vui và tiết kiệm.'],['Cắm trại nơi hoang dã',79,'Một đêm dưới bầu trời sao.']],
 [['Nhà hàng Michelin',5000,'Một bữa tối thật đặc biệt.'],['Nhà hàng địa phương',1200,'Thử hương vị của một vùng đất mới.'],['Quán ven đường',200,'Món ngon ở ngay góc phố.'],['Mì ăn liền tại khách sạn',20,'Đơn giản thôi, miễn là có nhau.']],
 [['Check-in danh thắng',300,''],['Thưởng thức đặc sản',500,''],['Dạo phố mua sắm',3000,''],['Chụp ảnh tại điểm nổi tiếng',100,''],['Thăm vườn thú',400,''],['Xem trình diễn thời trang',800,''],['Khám phá cửa tiệm độc đáo',2000,''],['Xem kịch hoặc nhạc kịch',1200,''],['Ở khách sạn ngủ hoặc chơi game',0,''],['Trải nghiệm mới lạ',800,'']],
 [['Váy dạ hội',500,''],['Túi xách hàng hiệu',79083,''],['Thắt lưng cao cấp',12753,''],['Bộ dưỡng da',49999,''],['Bộ trang điểm',50999,''],['Đàn piano',100000,''],['Dây chuyền ngọc lục bảo',999999,'']]
];
export const stages=[
 {name:'Chờ khai máy',chapter:'Chuẩn bị',note:'Mời sáu người chơi vào phòng. Phân vai theo phiếu trắc nghiệm trong DM Book. App không thay thế kịch bản giấy.'},
 {name:'Những lời đồn đầu tiên',chapter:'Màn hai',note:'Mở bảng tin 1–6. Mời từng người đọc và để những người còn lại tự giải thích. Chưa công bố các cặp thật.'},
 {name:'Ghi hình chương trình',chapter:'Màn ba',note:'Sau khi ba người chơi nam giải thích việc hoán đổi linh hồn, cụ Mạnh công bố đây là chương trình truyền hình. Từ mốc này, app hiện danh tính thật và ghép cặp: Lý Trạch Viễn – Lâm Vũ, Kiều Dã – Ôn Ấu Vi, Tống Bạc Giản – Diệp Tiêu Tiêu. Mở bài 7–9 và lượt đăng cảm nghĩ thứ nhất.'},
 {name:'Hành trình chân ái',chapter:'Màn ba',note:'Mỗi cặp nhận 100.000. Ba vòng đầu chọn một đáp án, không thảo luận. Vòng vui chơi chọn tối đa chín mục. Tính xong chi phí mới chuyển vòng.'},
 {name:'Cùng nhau du lịch',chapter:'Màn ba',note:'Sau lễ cưới thử: đăng ảnh chính thức của chương trình, rồi mở lượt đăng cảm nghĩ thứ hai. Giữ nguyên lời thoại báo trước của cụ Mạnh trong DM Book.'},
 {name:'Lời hẹn ba năm',chapter:'Màn bốn',note:'Mở bài 10–21, tiến hành Bạn nói tôi đoán theo thẻ manh mối giấy. Cuối màn mời sáu người đăng cảm nghĩ lần ba.'},
 {name:'Lời hẹn năm năm',chapter:'Màn năm',note:'Không đẩy thêm bài. Dùng thẻ manh mối 1–6, lễ trao huy chương và lời thoại bắt buộc trong DM Book.'},
 {name:'Lời hẹn bảy năm',chapter:'Màn sáu',note:'DM chuyển vai Tiểu Mạnh. Chuẩn bị tâm lý riêng, dùng thư và đạo cụ giấy; phát âm thanh lời cầu hôn đúng thời điểm.'},
 {name:'Một bó hoa để nhớ',chapter:'Màn bảy · Kết cục',note:'Chỉ mở sau cuộc gọi cụ Mạnh, phát cuốn kết cục và lời tổng kết. Kỷ niệm gồm ba bài tự viết của từng người và ảnh của chương trình.'}
];
export const writingStages={2:1,4:2,5:3};
export const writingLabels=['','Ghi hình chương trình','Cùng nhau du lịch','Lời hẹn ba năm'];
export const money=n=>new Intl.NumberFormat('vi-VN').format(n);
