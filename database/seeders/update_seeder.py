#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to automatically add detailed_description to ProductSeeder.php
"""

import re

# Mapping album names to their detailed descriptions
ALBUM_DESCRIPTIONS = {
    "Diễm Xưa": """Diễm Xưa là một trong những tuyển tập tiêu biểu nhất của dòng nhạc Trịnh Công Sơn qua giọng hát Khánh Ly. Album không chỉ là tập hợp các ca khúc mà còn là một cuốn nhật ký bằng âm nhạc, ghi lại những rung động tinh tế, nỗi buồn man mác và triết lý nhân sinh sâu sắc của người nhạc sĩ tài hoa. Sự kết hợp giữa ca từ đầy tính thơ của Trịnh và chất giọng "liêu trai", khàn đục đặc trưng của Khánh Ly đã tạo nên một tượng đài trong tân nhạc Việt Nam.

Trong album này, người nghe sẽ được đắm chìm trong không gian của những hoài niệm với bản thu âm kinh điển của ca khúc chủ đề "Diễm Xưa" - tác phẩm đã vượt ra khỏi biên giới Việt Nam để được yêu mến tại Nhật Bản. Bên cạnh đó, "Biển Nhớ" và "Hạ Trắng" mang đến những khắc khoải về tình yêu và sự chia ly, trong khi "Nối Vòng Tay Lớn" lại là tiếng gọi của sự đoàn kết và tình người.

Bản thu âm trong tuyển tập này giữ được chất mộc mạc, chân thật của những phòng thu Sài Gòn xưa, nơi kỹ thuật không lấn át cảm xúc. Đây là đĩa nhạc không thể thiếu cho bất kỳ ai muốn tìm về cội nguồn của Nhạc Trịnh và văn hóa phòng trà Việt Nam thập niên cũ.""",

    "Tôi Sẽ Quay Về": """Album Tôi Sẽ Quay Về là cột mốc quan trọng đánh dấu thời kỳ hoàng kim của Làn Sóng Xanh và sự nghiệp rực rỡ của "Anh Hai" Lam Trường. Ra đời trong giai đoạn nhạc trẻ Việt Nam bắt đầu chuyển mình mạnh mẽ vào cuối những năm 90, album mang đậm hơi thở của Cantopop (nhạc Pop Hồng Kông) nhưng được Việt hóa đầy tinh tế, phù hợp với tâm tư của khán giả trẻ thời bấy giờ.

Điểm nhấn không thể bỏ qua của album là bản hit quốc dân "Tình Thôi Xót Xa". Giai điệu bắt tai cùng lời ca da diết về mối tình đơn phương đã giúp ca khúc này thống trị các bảng xếp hạng trong nhiều năm liền và trở thành bài hát nằm lòng của thế hệ 8x, 9x đời đầu. Các ca khúc khác như "Tôi Sẽ Quay Về" hay "Tình Ca Không Quên" tiếp tục khẳng định khả năng xử lý ballad ngọt ngào và kỹ thuật luyến láy đặc trưng của Lam Trường.

Sản phẩm này không chỉ là một đĩa nhạc giải trí mà còn là một kỷ vật của thanh xuân, gợi nhớ về thời kỳ băng cassette và những cuốn sổ chép lời bài hát. Chất lượng âm thanh được remaster lại giúp giữ nguyên vẹn cảm xúc nguyên bản nhưng rõ nét hơn trên định dạng Vinyl.""",

    "Đàm Vĩnh Hưng & Những Tình Khúc Bất Hủ": """Trong album này, Đàm Vĩnh Hưng - "Ông hoàng nhạc Việt" - đã thực hiện một cuộc dạo chơi đầy táo bạo khi khoác lên những tình khúc Bolero và nhạc xưa một lớp áo mới. Không đi theo lối hát nức nở truyền thống, Mr. Đàm mang vào đó chất giọng khàn, gằn đầy nội lực và sự khắc khoải của một người đàn ông từng trải, tạo nên thương hiệu "nhạc xưa kiểu Đàm Vĩnh Hưng".

Tuyển tập bao gồm những nhạc phẩm vàng son như "Biển Tình", "Xin Lỗi Tình Yêu", nơi mỗi nốt nhạc đều thấm đẫm nỗi niềm cô đơn và khát vọng yêu đương. Cách hòa âm phối khí trong album cũng được đầu tư công phu, kết hợp giữa nhạc cụ cổ điển và phong cách pop hiện đại, giúp các ca khúc vừa giữ được hồn cốt xưa cũ, vừa dễ dàng tiếp cận với khán giả thời đại mới.

Đây là album minh chứng cho sự đa năng và sức sáng tạo không nghỉ của Đàm Vĩnh Hưng. Nó phù hợp cho những đêm nhạc phòng trà, những không gian tĩnh lặng cần sự chiêm nghiệm về tình yêu và cuộc đời qua lăng kính của dòng nhạc trữ tình.""",

    "Tình Ca Phạm Duy": """Tình Ca Phạm Duy là một công trình nghệ thuật đồ sộ, tôn vinh di sản âm nhạc của nhạc sĩ Phạm Duy - người được mệnh danh là "phù thủy âm nhạc" của Việt Nam. Album này tuyển chọn những sáng tác tiêu biểu nhất trải dài qua nhiều giai đoạn sáng tác của ông, từ những bản dân ca mới, tình ca quê hương cho đến những bản tình ca đôi lứa đầy triết lý và lãng mạn.

Người nghe sẽ bắt gặp một "Tình Ca" hào hùng, thắm đượm tình yêu nước và tiếng Việt, hay một "Cỏ Úa" đầy day dứt về những mối tình đã qua. Các ca khúc được trình bày bởi những giọng ca hàng đầu, những người hiểu và thấm nhuần tinh thần nhạc Phạm Duy, giúp truyền tải trọn vẹn ý niệm về "Khóc, Cười, Nổi, Trôi" trong âm nhạc của ông.

Với chất lượng thu âm đạt chuẩn audiophile, album tái hiện không gian âm nhạc rộng lớn, từ những giai điệu ngũ cung phương Đông đến những hòa thanh phức tạp của phương Tây mà Phạm Duy đã khéo léo dung hòa. Đây là viên ngọc quý cho bộ sưu tập đĩa than của những người yêu nhạc tiền chiến và tân nhạc Việt Nam.""",

    "Nửa Vầng Trăng": """Album Nửa Vầng Trăng là một tuyển tập đặc sắc quy tụ những giọng ca vàng của dòng nhạc trữ tình hải ngoại và trong nước thập niên 90 và đầu 2000. Tựa đề album lấy cảm hứng từ ca khúc cùng tên rất nổi tiếng, gợi mở một không gian âm nhạc lãng mạn, man mác buồn và đậm chất thơ, đặc trưng của các sản phẩm do trung tâm Thúy Nga phát hành.

Sự đa dạng trong album thể hiện qua việc lựa chọn bài hát, từ những bản Bolero mùi mẫn đến những ca khúc quê hương mang âm hưởng dân ca ngọt ngào như "Mưa Rơi Lặng Thầm". Phần hòa âm được chăm chút kỹ lưỡng với dàn nhạc dây và nhạc cụ dân tộc, tạo nên một phông nền sang trọng để tôn vinh chất giọng của các nghệ sĩ.

Đây là chiếc đĩa than lý tưởng cho những buổi tối quây quần bên gia đình, mang lại cảm giác ấm cúng và hoài niệm. Album không chỉ là âm nhạc, mà còn là ký ức của một thời kỳ băng đĩa sôi động, nơi những giai điệu trữ tình là món ăn tinh thần không thể thiếu của người Việt.""",

    "Abbey Road": """Abbey Road là album phòng thu thứ mười một và cũng là lần cuối cùng bộ tứ huyền thoại The Beatles cùng nhau bước vào phòng thu. Mặc dù được phát hành trước *Let It Be*, nhưng đây thực sự là lời chia tay nghệ thuật đầy viên mãn của ban nhạc. Bìa album với hình ảnh bốn thành viên đi qua vạch kẻ đường bên ngoài studio đã trở thành một trong những hình ảnh mang tính biểu tượng nhất lịch sử văn hóa đại chúng.

Về mặt âm nhạc, Abbey Road là đỉnh cao của kỹ thuật sản xuất và cấu trúc bài hát. Mặt A chứa đựng những bản hit độc lập mạnh mẽ như "Come Together" đầy ma mị của John Lennon và "Something" - bản tình ca vĩ đại nhất mà George Harrison từng viết. Tuy nhiên, điểm sáng chói lọi nhất nằm ở mặt B với chuỗi medley dài 16 phút, một kiệt tác của việc ghép nối các đoạn nhạc rời rạc thành một dòng chảy giao hưởng liền mạch, kết thúc bằng câu hát triết lý: "And in the end, the love you take is equal to the love you make."

Sở hữu đĩa than Abbey Road là sở hữu một chương cuối hoàn hảo của cuốn sách lịch sử The Beatles. Âm thanh ấm áp, dải động rộng của bản in Vinyl sẽ làm nổi bật tiếng bass uy lực của Paul McCartney và những đoạn solo guitar đan xen điêu luyện trong "The End".""",
}


def add_detailed_description(seeder_content):
    """
    Add detailed_description field to each album in the seeder
    """
    result = seeder_content
    
    for album_name, description in ALBUM_DESCRIPTIONS.items():
        # Escape special characters for regex
        escaped_name = re.escape(album_name)
        
        # Pattern to find the album entry
        # Match from 'name' => to the comma after 'description'
        pattern = rf"('name' => '{escaped_name}',\s*'description' => '[^']*',)"
        
        # Replacement with detailed_description added
        escaped_description = description.replace('\\', '\\\\').replace("'", "\\'")
        replacement = rf"\1\n                'detailed_description' => '{escaped_description}',"
        
        result = re.sub(pattern, replacement, result)
    
    return result


def main():
    seeder_file = 'ProductSeeder.php'
    
    # Read the seeder file
    with open(seeder_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add detailed descriptions
    updated_content = add_detailed_description(content)
    
    # Write back to file
    with open(seeder_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"✅ Successfully updated {seeder_file}")
    print(f"📝 Added detailed_description for {len(ALBUM_DESCRIPTIONS)} albums")


if __name__ == '__main__':
    main()
