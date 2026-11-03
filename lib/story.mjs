// Bản Việt hóa từ ảnh bảng tin, giữ các quan hệ gây hiểu nhầm ở mốc 1–6.
export const story=[
 ['Nhật báo Tây Thành','Hai gia đình thương nghiệp họ Tống ở Tây Thành và họ Ôn ở Hải Thành được cho là sắp kết thông gia. Công tử Tống Bạc Giản và tiểu thư Ôn Ấu Vi đúng là trai tài gái sắc.'],
 ['Nhật báo Tây Thành','Phóng viên nhận được một bức ảnh: dưới ánh trăng, Tống Bạc Giản khoác áo vest lên vai Ôn Ấu Vi. Ánh mắt dịu dàng ấy dường như chẳng thể giấu được.'],
 ['Tường tỏ tình Đại học Tây Thành','Tình yêu thời thanh xuân thật ngọt ngào. Dạo gần đây Lâm Vũ và Kiều Dã liên tục xuất hiện trên bảng tin của chúng mình!'],
 ['Tường tỏ tình Đại học Tây Thành','Một người bạn kể: trên sân bóng, Kiều Dã để lộ vết sẹo xấu xí. Lâm Vũ nhón chân băng bó cho anh, còn anh cười thật ngọt. Có ai muốn biết hai người đã nói gì không?'],
 ['Bản tin khu phố','Lý Trạch Viễn vốn không thích trò chơi điện tử, nhưng đã học thuộc kỹ năng của từng tướng, xem rất nhiều video và viết cả một cuốn hướng dẫn tặng cô bạn thanh mai trúc mã Diệp Tiêu Tiêu. Anh luôn đứng sau cô ấy.'],
 ['Bản tin khu phố','Nghe nói Diệp Tiêu Tiêu đã chuẩn bị một món quà công nghệ thật đặc biệt để cổ vũ Lý Trạch Viễn dũng cảm theo đuổi ước mơ. Hai người bạn lớn lên cùng nhau lại có tin mới rồi!'],
 ['Tuyết Lê mê thần tượng','Tin nóng từ chương trình Tình Yêu Tựa Một Bó Hoa! Kỳ tiếp theo sẽ đưa khách mời đi du lịch. Mong nhất chuyện tình thanh mai trúc mã của Lý Trạch Viễn và Lâm Vũ!'],
 ['Tin nhanh A Văn','Chàng cầu thủ mới nổi Kiều Dã và Ôn Ấu Vi đã trải qua biết bao thử thách. Mười năm chờ đợi, mười năm thanh xuân, cuối cùng cũng nở hoa.'],
 ['Trạm tin Sao Hỏa','Công tử Tống Bạc Giản và nữ tuyển thủ Diệp Tiêu Tiêu gặp gỡ, yêu nhau trên mạng rồi đến bên nhau ngoài đời. Chuyện tình của họ đang nhận rất nhiều lời chúc phúc.'],
 ['Chim Nhỏ cất cánh','Những lời thần linh không nghe, Lý Trạch Viễn sẽ nghe.'],
 ['Don Quixote','Vì định hướng phát triển cá nhân và nhiều lý do khác, cuối cùng tôi đã chọn gia nhập đội tuyển Tây Thành! Tôi tin đội tuyển mới thành lập này sẽ ngày càng tiến xa. Mọi người hãy chờ nhé!'],
 ['Don Quixote','Mỗi trận đấu đều là một bậc thang đưa em tiến về phía trước. Nhất định em sẽ thành công, còn anh chính là người hỗ trợ tốt nhất của em!'],
 ['Chim Nhỏ cất cánh','Đúng là một anh chàng kỹ thuật thẳng thắn đến ngốc nghếch!!!!!'],
 ['Lý Trạch Viễn cố gắng, cố gắng hơn nữa','Sắp được đến Mỹ tìm Lâm Vũ rồi! Đến lúc đó nhất định phải cảm ơn hiệu trưởng của cô ấy thật tử tế!'],
 ['Hiệp sĩ Trăng Non của Don Quixote','Thế giới thật hoang đường, nhưng anh sẽ luôn ở bên em.'],
 ['Mèo Ấu Vi','Titanic cuối cùng cũng chiếu lại rồi! Kiều Dã đúng là một tên đại ngốc!'],
 ['Yêu Ôn Ấu Vi nhất thế giới','Đáng ghét, rõ ràng đã rất cố gắng rồi. Tại sao vẫn không được ra sân…'],
 ['Mèo Ấu Vi','Bố Bố đáng yêu nhất thế giới!'],
 ['Lý Trạch Viễn cố gắng, cố gắng hơn nữa','Tất cả những bộ phim về sau, chúng mình đều phải xem cùng nhau!'],
 ['Hiệp sĩ Trăng Non của Don Quixote','Bữa cơm tất niên năm nay đặc biệt ngon, vì có em ở bên anh!'],
 ['Yêu Ôn Ấu Vi nhất thế giới','“Trời vừa sáng, tuyết vừa ngừng, chúng mình đi kết hôn nhé.”']
].map(([author,text],i)=>({id:'story-'+(i+1),author,text,unlock:i<6?1:i<9?2:5,number:i+1,...(i>=9?{image:'/story/post-'+(i+1)+'.jpg'}:{})}));
