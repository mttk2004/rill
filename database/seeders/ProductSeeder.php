<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 50 album thật với mô tả chi tiết và giá VNĐ
        $albums = [
            // Nhạc vàng Việt Nam
            [
                'name' => 'Diễm Xưa',
                'image' => 'products/iEfLvIFjGm7OXUL7HL5rFCvd0y4j3ravH6uSSSHN.webp',
                'description' => 'Album tuyển tập những ca khúc bất hủ của nhạc sĩ Trịnh Công Sơn do Khánh Ly thể hiện. Bao gồm các tác phẩm như "Diễm Xưa", "Biển Nhớ", "Nối Vòng Tay Lớn" - những sáng tác đi vào lòng người Việt.',
                'detailed_description' => '**Diễm Xưa** là một trong những tuyển tập tiêu biểu nhất của dòng nhạc Trịnh Công Sơn qua giọng hát Khánh Ly. Album không chỉ là tập hợp các ca khúc mà còn là một cuốn nhật ký bằng âm nhạc, ghi lại những rung động tinh tế, nỗi buồn man mác và triết lý nhân sinh sâu sắc của người nhạc sĩ tài hoa.

Sự kết hợp giữa ca từ đầy tính thơ của Trịnh và chất giọng *"liêu trai"*, khàn đục đặc trưng của Khánh Ly đã tạo nên một tượng đài trong tân nhạc Việt Nam.

Trong album này, người nghe sẽ được đắm chìm trong không gian của những hoài niệm với bản thu âm kinh điển của ca khúc chủ đề **"Diễm Xưa"** - tác phẩm đã vượt ra khỏi biên giới Việt Nam để được yêu mến tại Nhật Bản. Bên cạnh đó, *"Biển Nhớ"* và *"Hạ Trắng"* mang đến những khắc khoải về tình yêu và sự chia ly, trong khi *"Nối Vòng Tay Lớn"* lại là tiếng gọi của sự đoàn kết và tình người.

Bản thu âm trong tuyển tập này giữ được chất mộc mạc, chân thật của những phòng thu Sài Gòn xưa, nơi kỹ thuật không lấn át cảm xúc. Đây là đĩa nhạc không thể thiếu cho bất kỳ ai muốn tìm về cội nguồn của Nhạc Trịnh và văn hóa phòng trà Việt Nam thập niên cũ.',
                'genre' => 'Nhạc Trịnh',
                'label' => 'Làng Văn',
                'price' => 450000,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Tôi Sẽ Quay Về',
                'image' => 'products/hhvK4qqY7gCRy58TMqWgm1CUZqnWjrBsgx221Z7K.webp',
                'description' => 'Tuyển tập các ca khúc của Lam Trường với phong cách ballad đầy cảm xúc, đánh dấu thời kỳ hoàng kim của nhạc trẻ Việt Nam cuối thập niên 1990. Album bao gồm "Tình Thôi Xót Xa", "Tình Ca Không Quên".',
                'detailed_description' => 'Album `Tôi Sẽ Quay Về` là cột mốc quan trọng đánh dấu thời kỳ hoàng kim của Làn Sóng Xanh và sự nghiệp rực rỡ của "Anh Hai" Lam Trường. Ra đời trong giai đoạn nhạc trẻ Việt Nam bắt đầu chuyển mình mạnh mẽ vào cuối những năm 90, album mang đậm hơi thở của Cantopop (nhạc Pop Hồng Kông) nhưng được Việt hóa đầy tinh tế, phù hợp với tâm tư của khán giả trẻ thời bấy giờ.

Điểm nhấn không thể bỏ qua của album là bản hit quốc dân "Tình Thôi Xót Xa". Giai điệu bắt tai cùng lời ca da diết về mối tình đơn phương đã giúp ca khúc này thống trị các bảng xếp hạng trong nhiều năm liền và trở thành bài hát nằm lòng của thế hệ 8x, 9x đời đầu. Các ca khúc khác như "Tôi Sẽ Quay Về" hay "Tình Ca Không Quên" tiếp tục khẳng định khả năng xử lý ballad ngọt ngào và kỹ thuật luyến láy đặc trưng của Lam Trường.

Sản phẩm này không chỉ là một đĩa nhạc giải trí mà còn là một kỷ vật của thanh xuân, gợi nhớ về thời kỳ băng cassette và những cuốn sổ chép lời bài hát. Chất lượng âm thanh được remaster lại giúp giữ nguyên vẹn cảm xúc nguyên bản nhưng rõ nét hơn trên định dạng Vinyl.',
                'genre' => 'Nhạc Trẻ',
                'label' => 'Vafaco',
                'price' => 380000,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Đàm Vĩnh Hưng & Những Tình Khúc Bất Hủ',
                'image' => 'products/jnzSafQkj5xc6fC9sWaCM9voGReM6aqKs4Elrkwz.webp',
                'description' => 'Album tuyển chọn những ca khúc kinh điển được Đàm Vĩnh Hưng thể hiện lại với phong cách độc đáo. Bao gồm "Biển Tình", "Xin Lỗi Tình Yêu", mang đến cảm xúc sâu lắng cho người nghe.',
                'detailed_description' => 'Trong album này, Đàm Vĩnh Hưng - "Ông hoàng nhạc Việt" - đã thực hiện một cuộc dạo chơi đầy táo bạo khi khoác lên những tình khúc Bolero và nhạc xưa một lớp áo mới. Không đi theo lối hát nức nở truyền thống, Mr. Đàm mang vào đó chất giọng khàn, gằn đầy nội lực và sự khắc khoải của một người đàn ông từng trải, tạo nên thương hiệu "nhạc xưa kiểu Đàm Vĩnh Hưng".

Tuyển tập bao gồm những nhạc phẩm vàng son như "Biển Tình", "Xin Lỗi Tình Yêu", nơi mỗi nốt nhạc đều thấm đẫm nỗi niềm cô đơn và khát vọng yêu đương. Cách hòa âm phối khí trong album cũng được đầu tư công phu, kết hợp giữa nhạc cụ cổ điển và phong cách pop hiện đại, giúp các ca khúc vừa giữ được hồn cốt xưa cũ, vừa dễ dàng tiếp cận với khán giả thời đại mới.

Đây là album minh chứng cho sự đa năng và sức sáng tạo không nghỉ của Đàm Vĩnh Hưng. Nó phù hợp cho những đêm nhạc phòng trà, những không gian tĩnh lặng cần sự chiêm nghiệm về tình yêu và cuộc đời qua lăng kính của dòng nhạc trữ tình.',
                'genre' => 'Nhạc Trữ Tình',
                'label' => 'TNCD',
                'price' => 420000,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Tình Ca Phạm Duy',
                'image' => 'products/W7654Wa2Pjtc3hBwsau76x1ft6FVwmC4AAmpWC58.webp',
                'description' => 'Tuyển tập những tình ca bất hủ của nhạc sĩ Phạm Duy, ghi dấu một thời kỳ vàng son của âm nhạc Việt Nam. Các ca khúc như "Tình Ca", "Cỏ Úa" được trình bày với đầy cảm xúc.',
                'detailed_description' => '`Tình Ca Phạm Duy` là một công trình nghệ thuật đồ sộ, tôn vinh di sản âm nhạc của nhạc sĩ Phạm Duy - người được mệnh danh là "phù thủy âm nhạc" của Việt Nam. Album này tuyển chọn những sáng tác tiêu biểu nhất trải dài qua nhiều giai đoạn sáng tác của ông, từ những bản dân ca mới, tình ca quê hương cho đến những bản tình ca đôi lứa đầy triết lý và lãng mạn.

Người nghe sẽ bắt gặp một "Tình Ca" hào hùng, thắm đượm tình yêu nước và tiếng Việt, hay một "Cỏ Úa" đầy day dứt về những mối tình đã qua. Các ca khúc được trình bày bởi những giọng ca hàng đầu, những người hiểu và thấm nhuần tinh thần nhạc Phạm Duy, giúp truyền tải trọn vẹn ý niệm về "Khóc, Cười, Nổi, Trôi" trong âm nhạc của ông.

Với chất lượng thu âm đạt chuẩn audiophile, album tái hiện không gian âm nhạc rộng lớn, từ những giai điệu ngũ cung phương Đông đến những hòa thanh phức tạp của phương Tây mà Phạm Duy đã khéo léo dung hòa. Đây là viên ngọc quý cho bộ sưu tập đĩa than của những người yêu nhạc tiền chiến và tân nhạc Việt Nam.',
                'genre' => 'Tân Cổ',
                'label' => 'Phạm Duy Music',
                'price' => 480000,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'Nửa Vầng Trăng',
                'image' => 'products/cjz6l6B4KmCezA7kEXGzUrtrT3je119n7Q3KO2jI.webp',
                'description' => 'Album tổng hợp các ca khúc trữ tình với giọng ca của nhiều nghệ sĩ nổi tiếng thập niên 1990s, bao gồm "Nửa Vầng Trăng", "Mưa Rơi Lặng Thầm", mang đến không khí hoài niệm.',
                'detailed_description' => 'Album `Nửa Vầng Trăng` là một tuyển tập đặc sắc quy tụ những giọng ca vàng của dòng nhạc trữ tình hải ngoại và trong nước thập niên 90 và đầu 2000. Tựa đề album lấy cảm hứng từ ca khúc cùng tên rất nổi tiếng, gợi mở một không gian âm nhạc lãng mạn, man mác buồn và đậm chất thơ, đặc trưng của các sản phẩm do trung tâm Thúy Nga phát hành.

Sự đa dạng trong album thể hiện qua việc lựa chọn bài hát, từ những bản Bolero mùi mẫn đến những ca khúc quê hương mang âm hưởng dân ca ngọt ngào như "Mưa Rơi Lặng Thầm". Phần hòa âm được chăm chút kỹ lưỡng với dàn nhạc dây và nhạc cụ dân tộc, tạo nên một phông nền sang trọng để tôn vinh chất giọng của các nghệ sĩ.

Đây là chiếc đĩa than lý tưởng cho những buổi tối quây quần bên gia đình, mang lại cảm giác ấm cúng và hoài niệm. Album không chỉ là âm nhạc, mà còn là ký ức của một thời kỳ băng đĩa sôi động, nơi những giai điệu trữ tình là món ăn tinh thần không thể thiếu của người Việt.',
                'genre' => 'Nhạc Trữ Tình',
                'label' => 'Thúy Nga',
                'price' => 350000,
                'stock_quantity' => 18,
            ],

            // The Beatles
            [
                'name' => 'Abbey Road',
                'image' => 'products/qImOIj1eFn4fmmsJhALbDPmIjNPq5l53Is1cR2tE.webp',
                'description' => 'Album phòng thu thứ mười một và cũng là album cuối cùng được thu âm của The Beatles, phát hành năm 1969. Được đánh giá là một trong những album vĩ đại nhất mọi thời đại với "Come Together", "Something", "Here Comes the Sun".',
                'detailed_description' => '`Abbey Road` là album phòng thu thứ mười một và cũng là lần cuối cùng bộ tứ huyền thoại The Beatles cùng nhau bước vào phòng thu. Mặc dù được phát hành trước *Let It Be*, nhưng đây thực sự là lời chia tay nghệ thuật đầy viên mãn của ban nhạc. Bìa album với hình ảnh bốn thành viên đi qua vạch kẻ đường bên ngoài studio đã trở thành một trong những hình ảnh mang tính biểu tượng nhất lịch sử văn hóa đại chúng.

Về mặt âm nhạc, `Abbey Road` là đỉnh cao của kỹ thuật sản xuất và cấu trúc bài hát. Mặt A chứa đựng những bản hit độc lập mạnh mẽ như "Come Together" đầy ma mị của John Lennon và "Something" - bản tình ca vĩ đại nhất mà George Harrison từng viết. Tuy nhiên, điểm sáng chói lọi nhất nằm ở mặt B với chuỗi medley dài 16 phút, một kiệt tác của việc ghép nối các đoạn nhạc rời rạc thành một dòng chảy giao hưởng liền mạch, kết thúc bằng câu hát triết lý: "And in the end, the love you take is equal to the love you make."

Sở hữu đĩa than `Abbey Road` là sở hữu một chương cuối hoàn hảo của cuốn sách lịch sử The Beatles. Âm thanh ấm áp, dải động rộng của bản in Vinyl sẽ làm nổi bật tiếng bass uy lực của Paul McCartney và những đoạn solo guitar đan xen điêu luyện trong "The End".',
                'genre' => 'Rock',
                'label' => 'Apple Records',
                'price' => 890000,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Sgt. Pepper\'s Lonely Hearts Club Band',
                'image' => 'products/y7KcyrYo2hk3PxXwyNzdbjQnpiK3pzWt3GN4HvKG.webp',
                'description' => 'Album phòng thu thứ tám của The Beatles phát hành năm 1967, được coi là album có ảnh hưởng nhất trong lịch sử nhạc rock. Một kiệt tác của nhạc psychedelic rock với "Lucy in the Sky with Diamonds", "A Day in the Life".',
                'detailed_description' => 'Được phát hành vào "Mùa hè tình yêu" năm 1967, `Sgt. Pepper\'s Lonely Hearts Club Band` không chỉ là một album nhạc rock, mà là một sự kiện văn hóa đã thay đổi vĩnh viễn bộ mặt của âm nhạc đại chúng. The Beatles đã rũ bỏ hình tượng "boyband" để khoác lên mình bộ trang phục sặc sỡ của ban nhạc giả tưởng Sgt. Pepper, cho phép họ tự do thử nghiệm mọi giới hạn của phòng thu mà không bị ràng buộc bởi việc phải biểu diễn live.

Album là sự pha trộn ảo diệu giữa Rock, nhạc cổ điển Ấn Độ, Vaudeville và Avant-garde. Từ ca khúc mở đầu ồn ào như một buổi hòa nhạc, đến thế giới ảo giác của "Lucy in the Sky with Diamonds", và kết thúc bằng hợp âm piano vang vọng kéo dài vô tận trong "A Day in the Life" - ca khúc được coi là đỉnh cao sáng tác của Lennon-McCartney. Kỹ thuật thu âm đa lớp, sử dụng băng ngược và các hiệu ứng âm thanh chưa từng có đã biến album này thành thánh kinh của Art Rock và Psychedelic Rock.

Trên định dạng đĩa than, bìa đĩa được thiết kế công phu với lời bài hát được in ở mặt sau (lần đầu tiên trong lịch sử rock) và các phụ kiện cắt dán đi kèm tạo nên trải nghiệm nghe nhìn trọn vẹn. Đây là album buộc phải có trong mọi bộ sưu tập.',
                'genre' => 'Psychedelic Rock',
                'label' => 'Parlophone',
                'price' => 950000,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'Revolver',
                'image' => 'products/03PxasQzVa4Zm7MZWukNdR7yQFqvKrpDPKd7C6tY.webp',
                'description' => 'Album phòng thu thứ bảy của The Beatles phát hành năm 1966, đánh dấu sự chuyển mình trong âm nhạc của ban nhạc. Bao gồm các ca khúc nổi tiếng như "Eleanor Rigby", "Yellow Submarine", "Tomorrow Never Knows".',
                'detailed_description' => 'Nếu *Sgt. Pepper* là bông hoa nở rộ rực rỡ, thì `Revolver` (1966) chính là hạt giống đầy đột phá. Đây là thời điểm The Beatles bắt đầu từ bỏ các chuyến lưu diễn để tập trung hoàn toàn vào phòng thu. Album đánh dấu sự trưởng thành vượt bậc trong tư duy sáng tác và sự tò mò vô tận với các âm thanh mới lạ, là cầu nối quan trọng chuyển giao từ Pop Rock sang Psychedelic.

"Eleanor Rigby" gây sốc khi loại bỏ hoàn toàn nhạc cụ rock để thay bằng dàn dây tứ tấu, kể câu chuyện cô đơn ám ảnh. "Yellow Submarine" mang đến không khí vui tươi như đồng dao nhưng lại chứa đựng nhiều hiệu ứng âm thanh sáng tạo. Đặc biệt, ca khúc kết thúc "Tomorrow Never Knows" với tiếng trống loop, giọng hát được xử lý qua loa Leslie và các vòng lặp băng (tape loops) đã đi trước thời đại cả chục năm, đặt nền móng cho nhạc điện tử sau này.

`Revolver` thường xuyên cạnh tranh với *Sgt. Pepper* cho danh hiệu album hay nhất mọi thời đại của The Beatles. Bản đĩa than tái hiện chân thực sự sắc sảo, gãy gọn và không gian âm nhạc tiên phong mà bộ tứ Liverpool đã tạo ra giữa thập niên 60.',
                'genre' => 'Rock',
                'label' => 'Parlophone',
                'price' => 850000,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'The Beatles (White Album)',
                'image' => 'products/BWiJgxvbUaBThXmCQJmLyH3OBal6lBDDkMPM22A3.webp',
                'description' => 'Album kép thứ chín của The Beatles phát hành năm 1968, nổi tiếng với bìa album trắng tinh khiết. Một tác phẩm đa dạng với 30 ca khúc thuộc nhiều thể loại khác nhau, từ rock đến folk.',
                'detailed_description' => 'Thường được gọi là "Album Trắng" do thiết kế bìa tối giản hoàn toàn, album kép phát hành năm 1968 này là bức chân dung chân thực nhất về bốn cá tính âm nhạc riêng biệt đang dần tách rời nhau. Không còn sự đồng nhất chặt chẽ như các album trước, `The White Album` là một bộ sưu tập hỗn loạn nhưng thiên tài, bao gồm 30 ca khúc trải dài trên hầu hết các thể loại âm nhạc tồn tại lúc bấy giờ.

Người nghe sẽ đi từ sự ồn ào, gào thét của Proto-metal trong "Helter Skelter", đến sự dịu dàng acoustic của "Blackbird", từ chất ska vui nhộn của "Ob-La-Di, Ob-La-Da" đến sự u ám, trừu tượng của "Revolution 9". Dù được thu âm trong bầu không khí căng thẳng nội bộ, album vẫn cho thấy khả năng sáng tác sung sức và đỉnh cao của từng thành viên.

Đĩa than `White Album` là một hành trình dài hơi và thú vị. Việc lật giở từng mặt đĩa để khám phá sự đa dạng điên rồ bên trong là một trải nghiệm mà định dạng số không thể mang lại. Đây là The Beatles ở trạng thái trần trụi và chân thật nhất.',
                'genre' => 'Rock',
                'label' => 'Apple Records',
                'price' => 1200000,
                'stock_quantity' => 20,
            ],

            // Pink Floyd
            [
                'name' => 'The Dark Side of the Moon',
                'image' => 'products/Opg2zhu4hV1VzgnOt4tldYeR7MPTqv1a57g1Dzps.webp',
                'description' => 'Album phòng thu thứ tám của Pink Floyd phát hành năm 1973, một trong những album bán chạy nhất mọi thời đại. Khám phá các chủ đề về xung đột, tham lam, thời gian và bệnh tâm thần qua âm nhạc progressive rock tuyệt vời.',
                'detailed_description' => 'Không chỉ là một album, `The Dark Side of the Moon` (1973) là một cột mốc văn hóa và là định nghĩa hoàn hảo cho khái niệm "Album Concept". Pink Floyd đã dệt nên một tấm thảm âm thanh liền mạch, khám phá những áp lực của cuộc sống hiện đại: thời gian ("Time"), tiền bạc ("Money"), chiến tranh ("Us and Them") và cái chết/sự điên loạn ("Brain Damage/Eclipse").

Về mặt kỹ thuật, album là một kỳ quan của phòng thu Abbey Road với sự tham gia của kỹ sư âm thanh Alan Parsons. Việc sử dụng các đoạn ghi âm phỏng vấn, tiếng đồng hồ reo, tiếng máy tính tiền và tiếng tim đập tạo nên một không gian điện ảnh sống động. Sự chuyển tiếp mượt mà giữa các bài hát khiến người nghe bị cuốn vào một chuyến đi thôi miên từ đầu đến cuối mà không thể dứt ra.

Với bìa đĩa lăng kính tam giác tán sắc ánh sáng mang tính biểu tượng, bản đĩa than của album này là vật phẩm bắt buộc cho mọi audiophile. Chất lượng âm thanh analog giúp tái tạo độ sâu, độ chi tiết và không gian mênh mang đặc trưng của Pink Floyd.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 920000,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'The Wall',
                'image' => 'products/y5tMXFgMY49q0nWRpMrMphIt0Ta1AFFyr29OmhHx.webp',
                'description' => 'Album kép phòng thu thứ mười một của Pink Floyd phát hành năm 1979, một rock opera kể về nhân vật Pink. Bao gồm các hit như "Another Brick in the Wall Part 2", "Comfortably Numb", một kiệt tác về sự cô lập.',
                'detailed_description' => '`The Wall` (1979) là một vở Rock Opera đầy tham vọng và kịch tính, kể về cuộc đời của nhân vật Pink - một ngôi sao nhạc rock bị dằn vặt bởi sự mất mát, cô lập và dần xây dựng một bức tường tinh thần ngăn cách bản thân với thế giới bên ngoài. Được dẫn dắt bởi Roger Waters, album mang màu sắc u tối, dằn vặt nhưng cũng đầy mãnh liệt.

Âm nhạc trong `The Wall` sắc bén và mang tính sân khấu cao. Ca khúc nổi tiếng nhất "Another Brick in the Wall, Part 2" với đoạn điệp khúc của dàn đồng ca thiếu nhi đã trở thành bài hát phản kháng trứ danh. "Comfortably Numb", với hai đoạn solo guitar của David Gilmour, thường xuyên được bình chọn là một trong những đoạn solo hay nhất mọi thời đại, mang lại cảm giác tê liệt và thăng hoa cùng lúc.

Album kép này đòi hỏi người nghe phải thưởng thức trọn vẹn để hiểu hết câu chuyện. Trên định dạng Vinyl, thiết kế bìa tối giản với hình bức tường gạch trắng cùng các hình minh họa ám ảnh bên trong (inner sleeves) là một phần không thể tách rời của tác phẩm nghệ thuật này.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 1100000,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Wish You Were Here',
                'image' => 'products/JOxPl7wltRLkR4GWLvbMyScwgGF6F8hw35jsjqas.webp',
                'description' => 'Album phòng thu thứ chín của Pink Floyd phát hành năm 1975, là lời tri ân cho thành viên sáng lập Syd Barrett. Album gồm các tác phẩm nổi tiếng như "Shine On You Crazy Diamond", "Wish You Were Here".',
                'detailed_description' => 'Được phát hành sau thành công khổng lồ của *Dark Side of the Moon*, `Wish You Were Here` (1975) là lời tự sự đầy cảm xúc và cũng là lời tri ân đau đớn dành cho Syd Barrett - thành viên sáng lập thiên tài nhưng bất hạnh của nhóm đã rời bỏ thực tại vì vấn đề tâm lý. Chủ đề xuyên suốt của album là sự "vắng mặt" (absence) và sự hoài nghi đối với ngành công nghiệp âm nhạc.

Tác phẩm được bao bọc bởi hai phần của thiên trường ca "Shine On You Crazy Diamond" - một bản progressive rock dài, chậm rãi và đầy ám ảnh với tiếng guitar 4 nốt đặc trưng của Gilmour. Ca khúc chủ đề "Wish You Were Here" với tiếng guitar acoustic mộc mạc mở đầu như phát ra từ một chiếc radio cũ, đã trở thành bài hát lửa trại kinh điển, gợi lên nỗi nhớ nhung da diết.

Đây được coi là album có chất lượng âm thanh hoàn hảo nhất của Pink Floyd. Sự cân bằng giữa nhạc cụ điện tử và acoustic, giữa cảm xúc cá nhân và không gian mênh mông, được tái hiện tuyệt vời trên đĩa than, mang lại trải nghiệm nghe nhạc sâu sắc và lắng đọng.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 880000,
                'stock_quantity' => 25,
            ],

            // Led Zeppelin
            [
                'name' => 'Led Zeppelin IV',
                'image' => 'products/yrQ92Akf6nxVWYTWJSuW9i9o2EqHilIBmbRaXGIo.webp',
                'description' => 'Album phòng thu thứ tư của Led Zeppelin phát hành năm 1971, bao gồm ca khúc huyền thoại "Stairway to Heaven". Được coi là một trong những album rock vĩ đại nhất với sự kết hợp hoàn hảo giữa hard rock, folk và blues.',
                'detailed_description' => 'Thường được gọi là `Led Zeppelin IV` hoặc *Zoso*, album phát hành năm 1971 này là đỉnh cao chói lọi của dòng nhạc Hard Rock thập niên 70. Không có tên ban nhạc hay tiêu đề trên bìa đĩa, Led Zeppelin để âm nhạc tự cất tiếng nói, và đó là một tiếng nói đầy uy lực, pha trộn hoàn hảo giữa sự dữ dội của Rock, sự bí ẩn của Folk và chất đời của Blues.

Tâm điểm của album là "Stairway to Heaven" - ca khúc rock được phát nhiều nhất trên đài phát thanh Mỹ, một bản epic phát triển từ những tiếng guitar acoustic nhẹ nhàng đến đoạn cao trào bùng nổ. Bên cạnh đó, "Black Dog" và "Rock and Roll" mang đến những cú riff guitar kinh điển của Jimmy Page và tiếng trống sấm sét của John Bonham, trong khi "Going to California" lại cho thấy khía cạnh mềm mại, lãng du của nhóm.

Sở hữu đĩa than `Led Zeppelin IV` là sở hữu một giáo trình mẫu mực về nhạc Rock. Âm thanh analog làm nổi bật độ động (dynamic) tuyệt vời của album, từ tiếng mandolin tinh tế đến bức tường âm thanh dày đặc ở những đoạn cao trào.',
                'genre' => 'Hard Rock',
                'label' => 'Atlantic Records',
                'price' => 890000,
                'stock_quantity' => 32,
            ],
            [
                'name' => 'Physical Graffiti',
                'image' => 'products/fE1QuQNNAdXtE6AnREE1n0fnCaDwHykhc1eKyDD0.webp',
                'description' => 'Album kép thứ sáu của Led Zeppelin phát hành năm 1975, cho thấy sự đa dạng trong phong cách âm nhạc của ban nhạc. Bao gồm "Kashmir", "Trampled Under Foot", một tác phẩm đồ sộ của hard rock.',
                'detailed_description' => 'Là album kép đầu tiên của nhóm, `Physical Graffiti` (1975) cho thấy một Led Zeppelin ở đỉnh cao phong độ và sự tự tin tuyệt đối. Album là một bữa tiệc âm nhạc thịnh soạn, mở rộng biên độ sáng tạo của ban nhạc ra khỏi khuôn khổ Blues-Rock thông thường để chạm tới Funk, Progressive Rock và âm hưởng phương Đông.

Kiệt tác "Kashmir" với nhịp điệu thôi miên và dàn dây hoành tráng là minh chứng rõ nhất cho sự vĩ đại của album này - một bài hát mà Robert Plant gọi là "nhạc Led Zeppelin đích thực nhất". Những ca khúc khác như "Trampled Under Foot" với tiếng đàn Clavinet sôi động hay bản ballad dài hơi "In My Time of Dying" đều cho thấy kỹ thuật chơi nhạc thượng thừa của cả bốn thành viên.

Bìa đĩa được thiết kế độc đáo với các cửa sổ cắt rỗng (die-cut) cho phép thay đổi hình ảnh bên trong là một điểm cộng lớn cho bản Vinyl. `Physical Graffiti` là một trải nghiệm nghe nhạc đồ sộ, mạnh mẽ và đầy cuốn hút.',
                'genre' => 'Hard Rock',
                'label' => 'Swan Song',
                'price' => 1150000,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Led Zeppelin II',
                'image' => 'products/0WVtxO1O6XF0szMvPm9Bkh2M8tVwJCKlqG5NN57F.webp',
                'description' => 'Album phòng thu thứ hai của Led Zeppelin phát hành năm 1969, củng cố vị thế của họ trong làng nhạc rock. Với các bản hit như "Whole Lotta Love", "Ramble On", album này định hình hard rock và heavy metal.',
                'detailed_description' => 'Được thu âm vội vã giữa các chuyến lưu diễn năm 1969, `Led Zeppelin II` mang năng lượng thô ráp, trực diện và đầy dục vọng. Đây được coi là bản thiết kế chi tiết cho dòng nhạc Heavy Metal sau này. Album tập trung vào các đoạn riff guitar nặng nề, tiếng bass dồn dập và giọng hát cao vút đầy khiêu khích của Robert Plant.

Ca khúc mở đầu "Whole Lotta Love" với đoạn riff mang tính biểu tượng và phần giữa (interlude) đầy những âm thanh kỳ quái, ma mị đã định nghĩa lại giới hạn của nhạc Rock trên sóng phát thanh. "Heartbreaker" và "Ramble On" tiếp tục khẳng định vị thế của Jimmy Page như một "phù thủy" của cây đàn guitar.

Trên đĩa than, `Led Zeppelin II` (đặc biệt là các bản in đầu tiên bởi Robert Ludwig) nổi tiếng với âm lượng lớn và dải trầm uy lực đến mức có thể làm nhảy kim đầu đĩa than rẻ tiền. Đây là album dành cho những ai yêu thích sự mạnh mẽ nguyên thủy của Rock\'n\'Roll.',
                'genre' => 'Hard Rock',
                'label' => 'Atlantic Records',
                'price' => 850000,
                'stock_quantity' => 28,
            ],

            // Queen
            [
                'name' => 'A Night at the Opera',
                'image' => 'products/hKMSoauPx88JghMc6bMF0nSNVASAMSFi12OLN4fa.webp',
                'description' => 'Album phòng thu thứ tư của Queen phát hành năm 1975, bao gồm ca khúc huyền thoại "Bohemian Rhapsody". Một kiệt tác của rock opera với sự kết hợp độc đáo giữa rock, opera và progressive.',
                'detailed_description' => 'Được mệnh danh là "Sgt. Pepper của Queen", `A Night at the Opera` (1975) là album đắt đỏ nhất từng được thực hiện vào thời điểm đó. Nó phá vỡ mọi quy tắc về thể loại, kết hợp Hard Rock với Opera, Music Hall, Folk và Pop. Queen đã sử dụng phòng thu như một nhạc cụ, chồng hàng trăm lớp giọng hát và guitar để tạo ra bức tường âm thanh đặc trưng mà không cần dùng đến synthesizer.

Tâm điểm của album, "Bohemian Rhapsody", là một bản trường ca điên rồ và thiên tài, chuyển từ ballad sang opera rồi đến hard rock, thách thức mọi quy chuẩn của một bài hát radio. Bên cạnh đó, "Love of My Life" là bản ballad lấy đi nước mắt của hàng triệu người, còn "You\'re My Best Friend" lại là giai điệu pop vui tươi, ngọt ngào.

Bản Vinyl của album này tái hiện không gian sân khấu rộng lớn và sự chi tiết trong từng lớp bè phối khí. Logo phượng hoàng của Queen được in nổi bật trên nền trắng sang trọng, xứng đáng là một kiệt tác cả về nghe lẫn nhìn.',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 920000,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'News of the World',
                'image' => 'products/jKUYy0rio32VSG4vEw0NFzRiXgNEBIXy3NSnUNJf.webp',
                'description' => 'Album phòng thu thứ sáu của Queen phát hành năm 1977, bao gồm hai anthem rock vĩ đại "We Will Rock You" và "We Are the Champions". Album này đã trở thành biểu tượng của văn hóa thể thao toàn cầu.',
                'detailed_description' => 'Sau sự phức tạp và bóng bẩy của các album trước, `News of the World` (1977) là sự trở lại với chất Rock mộc mạc, gai góc và trực diện hơn, phản ứng lại sự trỗi dậy của phong trào Punk Rock lúc bấy giờ. Album được thiết kế để phục vụ cho các sân vận động, nơi khán giả có thể hòa mình vào âm nhạc.

Điều này thể hiện rõ nhất qua hai ca khúc mở đầu: "We Will Rock You" với tiếng dậm chân vỗ tay tạo nhịp, và "We Are the Champions" với giai điệu hào hùng chiến thắng. Hai bài hát này đã vượt ra khỏi biên giới âm nhạc để trở thành thánh ca của thể thao toàn cầu. Tuy nhiên, album cũng chứa đựng những viên ngọc ẩn giấu như bản jazz-rock "Sleeping on the Sidewalk" hay bản ballad buồn "All Dead, All Dead".

Bìa đĩa với hình ảnh robot khổng lồ cầm trên tay các thành viên ban nhạc là một trong những bìa đĩa ấn tượng và dễ nhận biết nhất thập niên 70.',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 880000,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'The Game',
                'image' => 'products/eynr7nZZfIOKFSKPS1RcNRdrojjcQMQ3CNqvm2ws.webp',
                'description' => 'Album phòng thu thứ tám của Queen phát hành năm 1980, đánh dấu sự chuyển hướng sang funk và disco. Bao gồm các hit "Another One Bites the Dust", "Crazy Little Thing Called Love".',
                'detailed_description' => 'Bước vào thập niên 80, Queen đã thực hiện một cú chuyển mình ngoạn mục với `The Game`. Đây là album đầu tiên nhóm sử dụng Synthesizer, đánh dấu sự thay đổi lớn trong tư duy sản xuất. Album mang âm hưởng gọn gàng, hiện đại và chịu ảnh hưởng của dòng nhạc Funk/Disco đang thịnh hành.

"Another One Bites the Dust" với tiếng bass kinh điển của John Deacon đã trở thành bản hit Disco-Rock lớn nhất của nhóm, chinh phục cả các sàn nhảy lẫn các đài phát thanh R&B. Ngược lại, "Crazy Little Thing Called Love" là màn tri ân Elvis Presley với phong cách Rockabilly mộc mạc, nơi Freddie Mercury chơi guitar acoustic.

`The Game` cho thấy khả năng thích nghi tuyệt vời của Queen với thời đại mới mà không đánh mất bản sắc. Đây là album thành công nhất của họ tại thị trường Mỹ, một đĩa nhạc Pop-Rock hoàn hảo, đa dạng và tràn đầy năng lượng.',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 850000,
                'stock_quantity' => 24,
            ],

            // Miles Davis - Jazz
            [
                'name' => 'Kind of Blue',
                'image' => 'products/APff5grSQ3O3Tb5D6dKG5sjiHoGuE5EtYfLce8bb.webp',
                'description' => 'Album jazz kinh điển của Miles Davis phát hành năm 1959, được coi là album jazz vĩ đại nhất mọi thời đại. Với sự tham gia của John Coltrane, Bill Evans, album này định nghĩa modal jazz và đã bán được hàng triệu bản.',
                'detailed_description' => '`Kind of Blue` (1959) không chỉ là album Jazz bán chạy nhất mọi thời đại, mà còn được coi là album nhạc Jazz vĩ đại nhất. Miles Davis, cùng với đội hình trong mơ gồm John Coltrane, Bill Evans, Cannonball Adderley, Paul Chambers và Jimmy Cobb, đã tạo ra một ngôn ngữ âm nhạc hoàn toàn mới dựa trên các thang âm (modal jazz) thay vì các vòng hòa thanh phức tạp truyền thống.

Âm nhạc trong album trôi chảy, tự do và mang màu sắc u buồn, trầm mặc nhưng vô cùng tinh tế. Ca khúc mở đầu "So What" với tiếng bass dạo đầu và đoạn hô đáp giữa kèn và piano đã trở thành giai điệu nhận diện của Jazz. Mỗi nốt nhạc được chơi ra đều mang sức nặng và cảm xúc, không có sự thừa thãi hay phô trương kỹ thuật.

Nghe `Kind of Blue` trên đĩa than là cách tốt nhất để cảm nhận "màu xanh" của album. Sự tĩnh lặng của nền nhựa vinyl làm nổi bật tiếng lấy hơi của kèn trumpet, tiếng chải cymbal nhẹ nhàng, đưa người nghe vào một quán bar jazz mờ khói lúc nửa đêm.',
                'genre' => 'Jazz',
                'label' => 'Columbia Records',
                'price' => 790000,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Sketches of Spain',
                'image' => 'products/7RZNYOAufLv5EdFUL2LbjNSikdTOfXr0y7guMncr.webp',
                'description' => 'Album của Miles Davis phát hành năm 1960, kết hợp jazz với âm nhạc cổ điển Tây Ban Nha. Được phối khí bởi Gil Evans, đây là một trong những album jazz orchestral đẹp nhất từng được thu âm.',
                'detailed_description' => 'Trong `Sketches of Spain` (1960), Miles Davis và nhà phối khí Gil Evans đã đưa Jazz thoát khỏi khuôn khổ của các câu lạc bộ đêm để bước vào thánh đường của âm nhạc giao hưởng thính phòng. Album là sự kết hợp đầy mê hoặc giữa ngôn ngữ Jazz Mỹ và âm hưởng dân gian, cổ điển Tây Ban Nha.

Tác phẩm trung tâm "Concierto de Aranjuez" dài 16 phút là một hành trình cảm xúc mãnh liệt, nơi tiếng kèn của Miles Davis vang lên cô độc, bi tráng trên nền dàn nhạc giao hưởng phong phú. Ông không chỉ thổi kèn, mà như đang hát, đang than khóc và kể chuyện qua nhạc cụ của mình.

Đây là một album đẹp, giàu hình ảnh và đầy tính điện ảnh. Trên định dạng đĩa than, độ rộng của sân khấu âm thanh (soundstage) được mở rộng tối đa, cho phép người nghe định vị được vị trí của từng nhạc cụ trong dàn nhạc, mang lại trải nghiệm nghe nhạc thính phòng đích thực.',
                'genre' => 'Jazz',
                'label' => 'Columbia Records',
                'price' => 750000,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Bitches Brew',
                'image' => 'products/3z33RAbE4U2m7kVTBF1jlVQfhlhSEvmROMxBumHL.webp',
                'description' => 'Album đột phá của Miles Davis phát hành năm 1970, khởi đầu kỷ nguyên jazz fusion. Kết hợp jazz với rock, funk và electronic, album này đã mở ra hướng đi mới cho jazz hiện đại.',
                'detailed_description' => 'Nếu *Kind of Blue* là sự tĩnh lặng, thì `Bitches Brew` (1970) là cơn bão hỗn mang đầy mê hoặc. Miles Davis đã phá bỏ mọi rào cản, kết hợp Jazz với Rock, Funk và Psychedelic, sử dụng nhạc cụ điện tử, hiệu ứng âm thanh và cấu trúc bài hát lỏng lẻo dựa trên sự ngẫu hứng tập thể.

Album là một nồi lẩu âm thanh sôi sục với nhiều tay trống, nhiều tay bass và keyboard chơi cùng lúc. Các bản nhạc dài như "Pharaoh\'s Dance" hay ca khúc chủ đề "Bitches Brew" không có khởi đầu hay kết thúc rõ ràng, chúng như những dòng chảy ý thức cuộn trào. Đây là tác phẩm tiên phong khai sinh ra dòng Jazz Fusion.

Bìa đĩa siêu thực (Surrealism) rực rỡ là sự phản chiếu hoàn hảo cho âm nhạc bên trong. Nghe `Bitches Brew` trên Vinyl là đắm mình vào một nghi lễ âm thanh hoang dã, nguyên thủy và đầy thách thức, đòi hỏi người nghe phải mở rộng tâm trí tối đa.',
                'genre' => 'Jazz Fusion',
                'label' => 'Columbia Records',
                'price' => 1200000,
                'stock_quantity' => 15,
            ],

            // John Coltrane
            [
                'name' => 'A Love Supreme',
                'image' => 'products/xukBu7L2BiCbbIt0Q14EqODIvGaN5B5CR5uMtdhB.webp',
                'description' => 'Album jazz tâm linh của John Coltrane phát hành năm 1965, được coi là kiệt tác của ông. Một tác phẩm bốn phần thể hiện hành trình tâm linh, đây là một trong những album jazz quan trọng và có ảnh hưởng nhất.',
                'detailed_description' => '`A Love Supreme` (1965) là đỉnh cao nghệ thuật và tâm linh của nghệ sĩ saxophone John Coltrane. Đây là một bản thánh ca không lời, một lời tạ ơn dâng lên Thượng Đế sau khi ông vượt qua được cơn nghiện ngập và tìm thấy sự giác ngộ. Album được chia thành 4 phần: "Acknowledgement", "Resolution", "Pursuance", và "Psalm".

Tiếng kèn tenor của Coltrane trong album này đạt đến độ chín muồi khủng khiếp: mãnh liệt, gào thét, nhưng cũng đầy khẩn cầu và thành kính. Đoạn motif 4 nốt "A Love Supreme" được lặp đi lặp lại trong phần đầu như một câu thần chú thôi miên. Phần cuối "Psalm" là sự chuyển hóa âm nhạc từ một bài thơ cầu nguyện, nơi tiếng kèn mô phỏng từng nhịp điệu của lời nói.

Đây là một trong những album quan trọng nhất lịch sử Jazz, có sức ảnh hưởng vượt ra ngoài âm nhạc. Bản đĩa than mang đến sự hiện diện chân thực của bộ tứ tấu, giúp người nghe cảm nhận được nguồn năng lượng tâm linh cháy bỏng mà Coltrane truyền tải.',
                'genre' => 'Jazz',
                'label' => 'Impulse!',
                'price' => 820000,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Blue Train',
                'image' => 'products/hAg02l1AqAiiHmxInMnBPbmkGAHeoYyX6jsAGCQW.webp',
                'description' => 'Album phòng thu của John Coltrane phát hành năm 1957, đánh dấu debut của ông với Blue Note Records. Một album hard bop kinh điển với ca khúc chủ đề "Blue Train" và sự tham gia của Lee Morgan.',
                'detailed_description' => 'Trước khi đi sâu vào những thử nghiệm tâm linh phức tạp, John Coltrane đã tạo ra `Blue Train` (1957) - album Hard Bop hoàn hảo nhất của ông cho hãng đĩa Blue Note. Album nổi bật với sự tham gia của dàn kèn hùng hậu gồm Lee Morgan (trumpet) và Curtis Fuller (trombone), tạo nên âm thanh dày dặn và sôi nổi.

Ca khúc chủ đề "Blue Train" với đoạn riff blues đơn giản nhưng ám ảnh đã trở thành chuẩn mực cho các jam session của giới chơi nhạc jazz. Các bản nhạc trong album vừa giữ được sự phức tạp trong hòa thanh của Coltrane ("Giant Steps" sơ khai), vừa có độ swing và giai điệu dễ tiếp cận.

Bìa đĩa với tông màu xanh dương và hình ảnh Coltrane đang trầm tư là một trong những bìa đĩa mang tính biểu tượng nhất của Blue Note. Bản đĩa than `Blue Train` là sự lựa chọn tuyệt vời cho những ai bắt đầu tìm hiểu về John Coltrane và dòng nhạc Hard Bop thập niên 50.',
                'genre' => 'Jazz',
                'label' => 'Blue Note',
                'price' => 780000,
                'stock_quantity' => 22,
            ],

            // Ella Fitzgerald
            [
                'name' => 'Ella Fitzgerald Sings the Cole Porter Song Book',
                'image' => 'products/RuFZRlFIXFCIg94EU9zHuoVuOc9xSwE7RS29MZ32.webp',
                'description' => 'Album của Ella Fitzgerald phát hành năm 1956, là phần đầu tiên trong series Song Books. Bà thể hiện các tác phẩm của Cole Porter với giọng hát trong trẻo và kỹ thuật hoàn hảo.',
                'detailed_description' => 'Đây là viên gạch đầu tiên đặt nền móng cho di sản đồ sộ "The Song Books" của Ella Fitzgerald. Phát hành năm 1956, album này đã nâng tầm nhạc Pop truyền thống lên hàng nghệ thuật. Ella không chỉ hát, bà tôn vinh từng ca từ, từng nốt nhạc của nhạc sĩ Cole Porter bằng giọng hát trong trẻo, kỹ thuật phrasing (ngắt câu) hoàn hảo và sự sang trọng tự nhiên.

Với 32 ca khúc, bao gồm những chuẩn mực như "Night and Day", "I Get a Kick Out of You", Ella đã chứng minh bà là người kể chuyện xuất sắc nhất của nền âm nhạc Mỹ. Phần đệm của Buddy Bregman vừa đủ để tôn vinh giọng hát mà không lấn át, tạo nên không gian thính phòng lịch lãm.

Sở hữu bộ đĩa than này giống như sở hữu một cuốn sách giáo khoa về nghệ thuật thanh nhạc. Chất âm analog ấm áp làm nổi bật sự mượt mà, tinh tế trong từng hơi thở của "First Lady of Song".',
                'genre' => 'Jazz Vocal',
                'label' => 'Verve',
                'price' => 750000,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Ella and Louis',
                'image' => 'products/4goE6HWw7xTv2aL76jxQ3eox559podbivVdIyrrr.webp',
                'description' => 'Album hợp tác giữa Ella Fitzgerald và Louis Armstrong phát hành năm 1956. Sự kết hợp giữa giọng soprano tinh khiết của Ella và giọng gravelly của Louis tạo nên một album jazz vocal bất hủ.',
                'detailed_description' => 'Một sự kết hợp "lạ lùng" nhưng hoàn hảo đến ngỡ ngàng. Giọng hát của Ella Fitzgerald - trong trẻo, bay bổng như pha lê - đặt cạnh giọng hát của Louis Armstrong - khàn đục, thô ráp như sỏi đá - đã tạo nên một sự tương phản đầy thú vị và duyên dáng. `Ella and Louis` (1956) là đỉnh cao của sự thư giãn và niềm vui trong âm nhạc.

Được đệm bởi bộ tứ của nghệ sĩ piano lừng danh Oscar Peterson, album mang không khí của một buổi gặp gỡ thân mật giữa những người bạn già. Những bản tình ca như "Cheek to Cheek", "They Can\'t Take That Away from Me" được thể hiện với sự ngẫu hứng nhẹ nhàng, nụ cười ẩn sau giọng hát và tiếng trumpet thi thoảng vang lên đầy cảm xúc.

Đây là đĩa nhạc "must-have" cho những ngày chủ nhật thảnh thơi. Âm thanh mono nguyên bản trên đĩa than mang lại sự tập trung tuyệt đối vào hai giọng ca huyền thoại, tạo cảm giác như họ đang biểu diễn ngay trong phòng khách của bạn.',
                'genre' => 'Jazz Vocal',
                'label' => 'Verve',
                'price' => 820000,
                'stock_quantity' => 20,
            ],

            // Louis Armstrong
            [
                'name' => 'Hello, Dolly!',
                'image' => 'products/MUKZuRicekhh6UYTkk5HBJX9Wgg3TKRTZ8MRlCIj.webp',
                'description' => 'Album của Louis Armstrong phát hành năm 1964, với ca khúc chủ đề cùng tên đã đánh bại Beatles trên bảng xếp hạng Billboard. Một album showcase giọng hát ấm áp và trumpet tuyệt vời của Satchmo.',
                'detailed_description' => 'Năm 1964, giữa tâm bão Beatlemania (cơn sốt The Beatles), một nghệ sĩ Jazz 63 tuổi đã đánh bật bộ tứ Liverpool khỏi vị trí số 1 bảng xếp hạng Billboard. Đó chính là Louis Armstrong với album `Hello, Dolly!`. Album này là minh chứng cho sức hút vượt thời gian và sự duyên dáng bất tận của "Satchmo" ở giai đoạn sau của sự nghiệp.

Ca khúc chủ đề "Hello, Dolly!" ban đầu chỉ là bản demo cho một vở nhạc kịch, nhưng qua tiếng hát nồng ấm và tiếng trumpet vui tươi của Louis, nó đã trở thành một hiện tượng toàn cầu. Album mang màu sắc Pop Jazz nhẹ nhàng, dễ nghe, với những bản tình ca như "A Kiss to Build a Dream On" hay "Moon River".

Dù không mang nặng tính học thuật hay thử nghiệm như các album Jazz trước đó, `Hello, Dolly!` lại là chiếc cầu nối đưa Louis Armstrong đến với khán giả đại chúng rộng rãi nhất. Đĩa than mang lại chất âm mộc mạc, ấm cúng, lưu giữ nụ cười rạng rỡ của một huyền thoại âm nhạc.',
                'genre' => 'Jazz',
                'label' => 'Kapp Records',
                'price' => 680000,
                'stock_quantity' => 25,
            ],

            // Nirvana
            [
                'name' => 'Nevermind',
                'image' => 'products/RnoHGWQfmu7X7EI7kTuniMuWdtnd5a6a2ApYT2wi.webp',
                'description' => 'Album phòng thu thứ hai của Nirvana phát hành năm 1991, đã thay đổi bộ mặt nhạc rock và đưa grunge vào mainstream. Với "Smells Like Teen Spirit", album này trở thành biểu tượng của thế hệ Generation X.',
                'detailed_description' => '`Nevermind` (1991) không chỉ là một album, nó là phát súng hiệu lệnh cho một cuộc cách mạng văn hóa. Nirvana đã đưa dòng nhạc Grunge từ những gara ẩm thấp ở Seattle ra ánh sáng, kết liễu kỷ nguyên Hair Metal hào nhoáng và trở thành tiếng nói của thế hệ X đầy bất mãn và âu lo.

Ca khúc mở đầu "Smells Like Teen Spirit" với đoạn riff guitar cào xé và tiếng trống bùng nổ đã trở thành thánh ca của sự nổi loạn. Sự kết hợp giữa giai điệu Pop bắt tai (lấy cảm hứng từ The Beatles) và sự ồn ào, méo mó của Punk Rock tạo nên sức hút không thể cưỡng lại. Kurt Cobain viết về sự thờ ơ, giận dữ và tổn thương bằng ca từ khó hiểu nhưng đầy sức nặng.

Bìa đĩa hình em bé bơi theo tờ đô-la là một trong những hình ảnh nổi tiếng nhất lịch sử. Nghe `Nevermind` trên đĩa than, bạn sẽ cảm nhận được trọn vẹn sự thô ráp, tiếng bass nặng trịch của Krist Novoselic và năng lượng bùng nổ mà định dạng số thường làm phẳng đi.',
                'genre' => 'Grunge',
                'label' => 'DGC Records',
                'price' => 850000,
                'stock_quantity' => 45,
            ],
            [
                'name' => 'In Utero',
                'image' => 'products/LF17R54yj6xN2tpLKBcBOxD85WWAp9ku8bMtgqga.webp',
                'description' => 'Album phòng thu thứ ba và cuối cùng của Nirvana phát hành năm 1993, thô ráp và trực diện hơn Nevermind. Album thể hiện sự giằng xé nội tâm của Kurt Cobain với các ca khúc như "Heart-Shaped Box".',
                'detailed_description' => 'Sau thành công choáng ngợp của *Nevermind*, Nirvana phản ứng lại sự nổi tiếng bằng `In Utero` (1993) - một album thô ráp, gai góc và khó tiếp cận hơn, được thu âm bởi "kỹ sư âm thanh purist" Steve Albini. Đây là bức chân dung chân thực và đau đớn về nội tâm giằng xé của Kurt Cobain trước khi anh qua đời.

Âm thanh của album không còn được trau chuốt bóng bẩy. Tiếng trống của Dave Grohl vang lên như trong một căn phòng trống, tiếng guitar rít lên đầy chói tai. "Heart-Shaped Box", "All Apologies" hay "Rape Me" là những tuyệt phẩm về sự mong manh, bệnh tật và tình yêu méo mó.

`In Utero` là lời trăng trối nghệ thuật đầy ám ảnh. Bản đĩa than của album này được giới audiophile săn đón vì giữ được chất âm "thật" mà Steve Albini chủ đích tạo ra: không nén, không lọc, trực diện và tàn nhẫn như chính thực tại.',
                'genre' => 'Grunge',
                'label' => 'DGC Records',
                'price' => 880000,
                'stock_quantity' => 30,
            ],

            // Radiohead
            [
                'name' => 'OK Computer',
                'image' => 'products/0FWmixn6RBkJsHclDCUagMQsSxZjYCYptkxMd1PZ.webp',
                'description' => 'Album phòng thu thứ ba của Radiohead phát hành năm 1997, một kiệt tác của alternative rock. Album khám phá alienation trong thời đại hiện đại với các ca khúc như "Paranoid Android", "Karma Police", "No Surprises".',
                'detailed_description' => '`OK Computer` (1997) thường được ví như *Dark Side of the Moon* của thế hệ Alternative Rock. Radiohead đã tạo ra một kiệt tác về nỗi lo âu trước sự bùng nổ của công nghệ, sự tha hóa của chủ nghĩa tiêu dùng và sự cô đơn trong xã hội hiện đại, ngay trước thềm thiên niên kỷ mới.

Album là sự mở rộng vĩ đại của cấu trúc nhạc Rock: những bản trường ca nhiều chương đoạn như "Paranoid Android", những bản ballad ru ngủ đầy ám ảnh như "No Surprises" hay "Karma Police". Thom Yorke hát bằng giọng ca falsetto mong manh, nức nở trên nền guitar không gian (atmospheric guitars) và những tiếng ồn điện tử tinh tế.

Đây là album định hình lại nhạc Rock Anh Quốc. Trên định dạng Vinyl 2 đĩa, không gian âm nhạc mênh mang, lạnh lẽo nhưng tuyệt đẹp của `OK Computer` được tái hiện hoàn hảo, đưa người nghe vào một thế giới dystopia đầy mê hoặc.',
                'genre' => 'Alternative Rock',
                'label' => 'Parlophone',
                'price' => 890000,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Kid A',
                'image' => 'products/gHIQBVxu0lLEACjl8p6F2JsZKaME8y8o5CqCSp3O.webp',
                'description' => 'Album phòng thu thứ tư của Radiohead phát hành năm 2000, đánh dấu sự chuyển hướng radical sang electronic và experimental. Một album đầy thách thức và đổi mới, định hình rock thập kỷ 2000.',
                'detailed_description' => 'Khi cả thế giới đang chờ đợi một *OK Computer* phần 2, Radiohead đã ném đi tất cả guitar để tạo ra `Kid A` (2000). Album này là cú sốc lớn nhất đầu thế kỷ 21, một cuộc cách mạng triệt để khi ban nhạc rock nổi tiếng nhất thế giới chuyển sang chơi nhạc điện tử, Ambient và Jazz thể nghiệm.

"Everything in Its Right Place" mở đầu với tiếng synth lặp lại đầy ma mị, báo hiệu một kỷ nguyên mới. Giọng hát của Thom Yorke bị cắt nhỏ, bóp méo, trở thành một nhạc cụ trong tổng thể âm thanh lạnh lẽo, trừu tượng của "Idioteque" hay "The National Anthem". Album không có đĩa đơn, không có video ca nhạc, chỉ có âm nhạc thuần túy nói lên sự hoang mang và trống rỗng.

`Kid A` là album thách thức người nghe nhưng phần thưởng nhận lại vô cùng xứng đáng. Bản đĩa than 10-inch đôi (hoặc bản 12-inch tái bản) là cách tuyệt vời nhất để thâm nhập vào những tầng lớp âm thanh dày đặc, phức tạp của kiệt tác này.',
                'genre' => 'Electronic Rock',
                'label' => 'Parlophone',
                'price' => 920000,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'In Rainbows',
                'image' => 'products/rV8GSJLf9P8FkRN0XXAiAtoTmvcfX0knsyUz3FhU.webp',
                'description' => 'Album phòng thu thứ bảy của Radiohead phát hành năm 2007, nổi tiếng với mô hình phát hành "pay what you want". Album kết hợp electronic với rock truyền thống, được đánh giá là một trong những album hay nhất của họ.',
                'detailed_description' => '`In Rainbows` (2007) là sự hòa giải tuyệt vời giữa những thử nghiệm điện tử lạnh lùng và sự ấm áp, nhân văn của nhạc cụ truyền thống. Sau nhiều năm, Radiohead trở nên "gần gũi" hơn, lãng mạn hơn và quyến rũ hơn. Album cũng nổi tiếng với mô hình phát hành "trả bao nhiêu tùy thích" gây chấn động ngành công nghiệp âm nhạc.

Âm nhạc trong album uyển chuyển và giàu nhịp điệu (rhythm), nổi bật với tiếng trống jazz gãy gọn của Phil Selway và những đường bass sexy. "Nude" - ca khúc được fan chờ đợi cả thập kỷ - cuối cùng cũng xuất hiện với vẻ đẹp lộng lẫy, trong khi "Weird Fishes/Arpeggi" là một cơn mưa của những tiếng guitar đan xen.

Đây là album "dễ nghe" nhất nhưng cũng tinh tế nhất của Radiohead thời kỳ hậu 2000. Bản đĩa than của `In Rainbows` được đánh giá rất cao về chất lượng audiophile, với độ tách bạch và chiều sâu âm trường xuất sắc.',
                'genre' => 'Alternative Rock',
                'label' => 'Self-released',
                'price' => 850000,
                'stock_quantity' => 32,
            ],

            // Kraftwerk
            [
                'name' => 'Trans-Europe Express',
                'image' => 'products/wBCGEhPHPxXNNzokt4J2OXBJUg38wvBwpKnClZMf.webp',
                'description' => 'Album thứ sáu của Kraftwerk phát hành năm 1977, một tác phẩm tiên phong của electronic music. Album lấy cảm hứng từ hành trình tàu hỏa xuyên châu Âu, đã ảnh hưởng sâu rộng đến hip hop và techno.',
                'detailed_description' => 'Nếu Kraftwerk là những người cha đỡ đầu của nhạc điện tử, thì `Trans-Europe Express` (1977) chính là bản tuyên ngôn quan trọng nhất. Album lấy cảm hứng từ mạng lưới tàu hỏa cao tốc Châu Âu, tôn vinh sự lãng mạn của công nghệ và sự kết nối lục địa già.

Với việc loại bỏ hoàn toàn gốc rễ Blues/Rock của âm nhạc Mỹ, Kraftwerk tạo ra thứ âm nhạc "Robot Pop" thuần khiết Châu Âu: nhịp điệu motorik lặp lại đều đặn, giai điệu synth bắt tai và giọng hát vocoder lạnh lùng. Ca khúc chủ đề đã trở thành nền tảng cho sự ra đời của Hip-hop (được Afrika Bambaataa sample) và Techno Detroit sau này.

Nghe `Trans-Europe Express` trên Vinyl là quay ngược thời gian về tương lai. Âm thanh analog ấm áp làm mềm đi những góc cạnh điện tử, tạo ra một không gian du hành hoài cổ nhưng vẫn đầy tính tiên phong.',
                'genre' => 'Electronic',
                'label' => 'Kling Klang',
                'price' => 820000,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'The Man-Machine',
                'image' => 'products/Yf8EHrE1kqF54Hcwr7COvhuHcuZ9qMsygQGJAt6Y.webp',
                'description' => 'Album thứ bảy của Kraftwerk phát hành năm 1978, khám phá mối quan hệ giữa con người và công nghệ. Với các ca khúc như "The Robots", "The Model", album này định hình synthpop và new wave.',
                'detailed_description' => 'Với `The Man-Machine` (1978), Kraftwerk hoàn thiện hình tượng "người máy" của mình với áo sơ mi đỏ, cà vạt đen đồng phục. Album tiếp tục khai thác mối quan hệ giữa nhân loại và máy móc, nhưng với giai điệu pop hóa hơn, dễ tiếp cận hơn và cấu trúc chặt chẽ hơn.

Bản hit "The Model" là ví dụ hoàn hảo cho khả năng viết nhạc pop bằng synthesizer của nhóm, trong khi "The Robots" là lời khẳng định danh tính nghệ thuật: "We are the robots". Âm nhạc của Kraftwerk ở giai đoạn này đạt đến độ tinh khiết tối giản, mỗi âm thanh đều có vị trí chính xác tuyệt đối.

Bìa đĩa lấy cảm hứng từ nghệ thuật Constructivism (Kiến tạo) của Nga là một tác phẩm nghệ thuật kinh điển. Đĩa than `The Man-Machine` không chỉ là âm nhạc, mà là một món đồ sưu tầm nghệ thuật pop-art, minh chứng cho tầm nhìn đi trước thời đại của nhóm nhạc Đức.',
                'genre' => 'Electronic',
                'label' => 'Kling Klang',
                'price' => 850000,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Autobahn',
                'image' => 'products/D49Gz0ArCYDeXGL8pkhCdY5EOsSpRAgMYU4WqgMR.webp',
                'description' => 'Album thứ tư của Kraftwerk phát hành năm 1974, đánh dấu sự chuyển mình sang electronic music hoàn toàn. Ca khúc chủ đề dài 22 phút mô phỏng hành trình trên đường cao tốc, một đột phá trong âm nhạc electronic.',
                'detailed_description' => '`Autobahn` (1974) là bước ngoặt lịch sử khi Kraftwerk chuyển mình từ một ban nhạc Krautrock thể nghiệm sang những người tiên phong của nhạc Pop điện tử. Ca khúc chủ đề dài 22 phút chiếm trọn mặt A của đĩa than là một bài thơ âm thanh mô tả cảm giác lái xe trên đường cao tốc Đức: tiếng khởi động xe, tiếng còi, tiếng gió lướt qua và nhịp điệu đều đặn của bánh xe trên mặt đường nhựa.

Sử dụng synthesizer (Moog) để mô phỏng mọi âm thanh thực tế, Kraftwerk đã chứng minh nhạc điện tử có thể mang tính mô tả và giàu cảm xúc. Giai điệu "Fahr\'n fahr\'n fahr\'n auf der Autobahn" đơn giản nhưng ám ảnh đã đưa nhóm lọt vào các bảng xếp hạng quốc tế.

Cầm trên tay chiếc đĩa than `Autobahn`, với bìa đĩa vẽ biểu tượng đường cao tốc đơn giản, là cầm trên tay tấm vé khởi hành cho chuyến đi vào kỷ nguyên nhạc số của nhân loại.',
                'genre' => 'Electronic',
                'label' => 'Philips',
                'price' => 790000,
                'stock_quantity' => 18,
            ],

            // Daft Punk
            [
                'name' => 'Discovery',
                'image' => 'products/wGfb6S0AOVSYtU0f3kkcBEeVyAI2WjpNlO5JmqI6.webp',
                'description' => 'Album phòng thu thứ hai của Daft Punk phát hành năm 2001, kết hợp house, disco, rock và synthpop. Với các hit như "One More Time", "Harder Better Faster Stronger", album này định nghĩa French house.',
                'detailed_description' => '`Discovery` (2001) là album đã biến Daft Punk từ những ngôi sao nhạc House hầm ngố thành những biểu tượng Pop toàn cầu trong trang phục Robot. Bộ đôi người Pháp đã khéo léo hồi sinh âm nhạc Disco, Glam Rock và R&B thập niên 70/80, lọc chúng qua lăng kính của nhạc điện tử hiện đại để tạo ra thứ âm thanh vừa hoài cổ vừa tương lai.

"One More Time" với giọng chỉnh auto-tune dày đặc đã trở thành thánh ca của mọi sàn nhảy. "Harder, Better, Faster, Stronger" là đỉnh cao của kỹ thuật sampling và cắt ghép vocoder. Album cũng là phần nhạc nền cho bộ phim hoạt hình *Interstella 5555*, tạo nên một vũ trụ hình ảnh độc đáo.

Trên định dạng Vinyl, `Discovery` mang lại năng lượng bùng nổ. Âm bass dày, nhịp điệu French House đặc trưng nghe "đã" hơn rất nhiều so với nhạc số. Đây là album định nghĩa lại nhạc Dance cho thế kỷ 21.',
                'genre' => 'Electronic',
                'label' => 'Virgin Records',
                'price' => 880000,
                'stock_quantity' => 38,
            ],
            [
                'name' => 'Random Access Memories',
                'image' => 'products/S7F5fHVRawuK0Di2CvKykYQQ5BVRL7IgQnsL6eYR.webp',
                'description' => 'Album phòng thu thứ tư của Daft Punk phát hành năm 2013, tribute đến disco và soft rock thập niên 1970s-80s. Với "Get Lucky" featuring Pharrell Williams, album này giành Album of the Year tại Grammy.',
                'detailed_description' => 'Khi cả thế giới đang chạy theo EDM ồn ào mà Daft Punk từng góp phần tạo ra, họ lại quay ngược 180 độ với `Random Access Memories` (2013). Album là lời tri ân xa xỉ dành cho kỷ nguyên vàng của âm nhạc Analog (thập niên 70, đầu 80). Họ hạn chế sampling, thay vào đó mời những huyền thoại sống như Nile Rodgers, Giorgio Moroder và các nhạc công hàng đầu vào phòng thu để chơi nhạc cụ thật.

Kết quả là một kiệt tác âm thanh sang trọng, ấm áp và đầy tính nhân văn. Bản hit toàn cầu "Get Lucky" mang âm hưởng Disco-Funk khiến cả thế giới nhún nhảy. "Touch" là một bản trường ca đầy xúc động về khao khát cảm xúc của robot. Album đã thắng giải Grammy cho Album của năm.

Đây là một trong những album có chất lượng thu âm tốt nhất thế kỷ 21 (Audiophile-grade). Bản đĩa than kép 180g là cách tuyệt vời nhất để thưởng thức sự chi tiết, độ động và sự ấm áp của các nhạc cụ analog trong album này.',
                'genre' => 'Electronic',
                'label' => 'Columbia Records',
                'price' => 950000,
                'stock_quantity' => 42,
            ],
            [
                'name' => 'Homework',
                'image' => 'products/W8oUhFBZvF7BIg1q0O1TMeMtgQSZY593v9BIOrqv.webp',
                'description' => 'Album debut của Daft Punk phát hành năm 1997, giới thiệu French house đến thế giới. Với các ca khúc như "Around the World", "Da Funk", album này đặt nền móng cho career huyền thoại của bộ đôi.',
                'detailed_description' => '`Homework` (1997) là tiếng nổ lớn đưa French Touch (House kiểu Pháp) lên bản đồ thế giới. Được thu âm ngay tại phòng ngủ (đúng như tên gọi), album mang năng lượng thô ráp, lặp lại (repetitive) đầy thôi miên và chất lofi quyến rũ của nhạc House và Techno underground.

"Da Funk" với tiếng synth méo mó như tiếng còi xe và "Around the World" với vòng lặp bassline kinh điển đã chứng minh rằng nhạc dance không cần lời hát phức tạp để gây nghiện. Daft Punk đã chắt lọc tinh hoa của Chicago House và Techno Detroit, thêm vào đó sự tinh quái kiểu Pháp.

Sở hữu `Homework` trên đĩa than là sở hữu nguồn gốc của huyền thoại. Âm thanh mộc, lực bass mạnh và sự "bụi bặm" của bản thu gốc được tái hiện nguyên vẹn, đưa người nghe về những bữa tiệc rave thập niên 90.',
                'genre' => 'Electronic',
                'label' => 'Virgin Records',
                'price' => 820000,
                'stock_quantity' => 30,
            ],

            // The Chemical Brothers
            [
                'name' => 'Dig Your Own Hole',
                'image' => 'products/hFLnleCXsHU5lq4AeAtfmJbK9pL22Z0iqAAzEfUD.webp',
                'description' => 'Album phòng thu thứ hai của The Chemical Brothers phát hành năm 1997, đỉnh cao của big beat. Với "Block Rockin\' Beats", "Setting Sun", album này định hình electronic dance music thập niên 1990s.',
                'genre' => 'Big Beat',
                'label' => 'Freestyle Dust',
                'price' => 850000,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Surrender',
                'image' => 'products/HumxAR05h6Lyoq0rZKczQsxRzQFSzzqh7ocdPIh2.webp',
                'description' => 'Album phòng thu thứ ba của The Chemical Brothers phát hành năm 1999, tiếp tục khai thác big beat với sự tinh tế hơn. Bao gồm "Hey Boy Hey Girl", "Let Forever Be" với sự góp giọng của Noel Gallagher.',
                'detailed_description' => 'Sau sự bùng nổ của Big Beat, `Surrender` (1999) cho thấy sự trưởng thành và hướng đi sâu sắc hơn của The Chemical Brothers. Album mở rộng bảng màu âm thanh sang House, Psychedelic và Pop, mang lại cảm giác bay bổng, mộng mơ hơn (euphoric) so với sự hung hăng của các album trước.

"Hey Boy Hey Girl" với câu sample kinh điển "Superstar DJs, here we go!" đã trở thành bài hát không thể thiếu tại mọi lễ hội âm nhạc. "Let Forever Be", tiếp tục hợp tác với Noel Gallagher, là một bản Psychedelic Rock hiện đại tuyệt vời. Album cân bằng hoàn hảo giữa những bản banger cho sàn nhảy và những khúc nhạc trippy để thưởng thức tại nhà.

Bìa đĩa với hình ảnh đám đông giơ tay lên trời thể hiện chính xác tinh thần của album: sự đầu hàng (surrender) trước sức mạnh kết nối của âm nhạc. Bản Vinyl là vật phẩm sưu tầm giá trị cho fan của kỷ nguyên Electronica 90s.',
                'genre' => 'Big Beat',
                'label' => 'Freestyle Dust',
                'price' => 880000,
                'stock_quantity' => 22,
            ],

            // Marvin Gaye
            [
                'name' => 'What\'s Going On',
                'image' => 'products/AwEKY8405LdMkqDRb9owDWNf4h507T8dlOF9MEAG.webp',
                'description' => '`What\'s Going On` (1971) thường xuyên đứng đầu các danh sách "Album hay nhất mọi thời đại" của các tạp chí uy tín. Đây là bước ngoặt khi Marvin Gaye thoát khỏi khuôn mẫu "hoàng tử tình ca" của Motown để trở thành một nghệ sĩ có lương tri xã hội. Album là một chuỗi ca khúc liền mạch (song cycle) phản ánh góc nhìn của một cựu chiến binh Việt Nam trở về Mỹ, chứng kiến sự bất công, nghèo đói, ma túy và ô nhiễm môi trường.

Âm nhạc trong album là sự pha trộn mượt mà giữa Soul, Jazz và Gospel. Giọng hát của Marvin Gaye, lúc thì thì thầm, lúc thì vút cao đau đớn, trôi trên nền nhạc đệm đa lớp tinh tế. Ca khúc chủ đề và "Mercy Mercy Me (The Ecology)" mang thông điệp vượt thời gian.

Nghe `What\'s Going On` trên đĩa than là một trải nghiệm tâm linh. Sự ấm áp của bản ghi Analog làm nổi bật không khí trò chuyện, tiếng ồn đường phố và sự kết nối giữa các bài hát, khiến người nghe cảm nhận sâu sắc nỗi đau và niềm hy vọng của tác giả.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 820000,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'Let\'s Get It On',
                'image' => 'products/VhqvJa3mEO8JRvVG7TTVxpzYazOhRT1libSGrBoA.webp',
                'description' => 'Album phòng thu thứ mười ba của Marvin Gaye phát hành năm 1973, một album sensual về tình yêu và sexuality. Ca khúc chủ đề trở thành một trong những love song mang tính biểu tượng nhất.',
                'detailed_description' => 'Nếu *What\'s Going On* là tiếng nói của tâm hồn và trí tuệ, thì `Let\'s Get It On` (1973) là tiếng nói của thể xác và dục vọng. Marvin Gaye đã biến tình dục thành một trải nghiệm tôn giáo thiêng liêng. Album này là chuẩn mực của dòng nhạc Soul/R&B lãng mạn, quyến rũ (Quiet Storm).

Ca khúc chủ đề với tiếng guitar "wah-wah" mở đầu và giọng hát đầy khao khát của Marvin đã trở thành bản tình ca biểu tượng cho sự thân mật. Album không chỉ nói về tình dục, mà còn là sự chữa lành và giải phóng bản thân thông qua tình yêu.

Chất âm của đĩa than cực kỳ phù hợp với không khí của album này: ấm, dày, mượt mà và gần gũi. Đây là chiếc đĩa than hoàn hảo cho những không gian riêng tư, lãng mạn.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 780000,
                'stock_quantity' => 24,
            ],

            // Stevie Wonder
            [
                'name' => 'Songs in the Key of Life',
                'image' => 'products/8ier1Pltjugq7I14x2zU2sUJwZ9l9Xc1oHKLztR4.webp',
                'description' => 'Album kép của Stevie Wonder phát hành năm 1976, được coi là kiệt tác của ông. Một tác phẩm đồ sộ với 21 ca khúc khám phá tình yêu, tâm linh và công bằng xã hội, giành Album of the Year tại Grammy.',
                'detailed_description' => '`Songs in the Key of Life` là album phòng thu thứ 18 của huyền thoại âm nhạc Mỹ Stevie Wonder. Được phát hành vào ngày 28 tháng 9 năm 1976 dưới dạng album kép bởi Tamla Records (một nhánh của Motown), đây được coi là đỉnh cao chói lọi nhất trong "thời kỳ cổ điển" (classic period) của ông, bắt đầu từ năm 1972.

Vào năm 1975, thất vọng với ngành công nghiệp âm nhạc và muốn cống hiến cho các hoạt động nhân đạo tại Ghana, Stevie Wonder đã nghiêm túc cân nhắc việc giải nghệ. Tuy nhiên, ông đã thay đổi quyết định và ký một hợp đồng kỷ lục trị giá 37 triệu đô la (tương đương hơn 200 triệu đô la ngày nay) với Motown, mang lại cho ông quyền kiểm soát nghệ thuật tuyệt đối. Kết quả của sự tự do đó là một kiệt tác đồ sộ khám phá mọi khía cạnh của cuộc sống: từ niềm vui làm cha ("Isn\'t She Lovely"), hồi ức tuổi thơ ("I Wish"), tôn vinh âm nhạc ("Sir Duke") đến các vấn đề xã hội ("Village Ghetto Land").

Album ra mắt ở vị trí số 1 trên Billboard 200 và trụ vững ở đó 14 tuần liên tiếp. Nó đã giành giải Grammy cho Album của năm và được Thư viện Quốc hội Mỹ lưu giữ vì giá trị văn hóa to lớn. Với 21 ca khúc trải dài trên nhiều thể loại từ R&B, Soul, Funk đến Pop và Jazz Fusion, bản đĩa than (kèm đĩa 7-inch bonus) là một kho báu âm nhạc đích thực, lan tỏa năng lượng tích cực và niềm yêu đời vô tận.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 1150000,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Innervisions',
                'image' => 'products/35WaL5TWcQnCsbyMtrS8hfOppyg2Jb1U47aDONwy.webp',
                'description' => 'Album phòng thu thứ mười sáu của Stevie Wonder phát hành năm 1973, khám phá các vấn đề xã hội và tâm linh. Với "Living for the City", "Higher Ground", album này giành Grammy Album of the Year.',
                'detailed_description' => '`Innervisions` (1973) là album tập trung, gai góc và mang tính chính trị nhất của Stevie Wonder. Nếu các album khác hướng ngoại, thì album này là cái nhìn sâu sắc vào nội tâm và thực trạng xã hội Mỹ thời bấy giờ: ma túy, phân biệt chủng tộc và áp lực đô thị.

Stevie Wonder đóng vai trò "ban nhạc một người", chơi hầu hết các nhạc cụ, đặc biệt là việc sử dụng sáng tạo đàn synthesizer TONTO để tạo ra những âm thanh chưa từng có. "Living for the City" là một thước phim âm thanh bi tráng về số phận người da đen, trong khi "Higher Ground" là bản Funk Rock tâm linh đầy sức mạnh.

Album đã giành giải Grammy Album của năm. Trên định dạng Vinyl, sự chi tiết và các lớp lang âm thanh của synthesizer được tái hiện sắc nét, cho thấy thiên tài sản xuất của Stevie Wonder.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 850000,
                'stock_quantity' => 26,
            ],
            [
                'name' => 'Talking Book',
                'image' => 'products/a4FUCsDmb0kZXIGV8lguZyaAiZydiP01HDuDRDAV.webp',
                'description' => 'Album phòng thu thứ mười lăm của Stevie Wonder phát hành năm 1972, bao gồm hai hit lớn "Superstition" và "You Are the Sunshine of My Life". Album đánh dấu thời kỳ hoàng kim của ông.',
                'detailed_description' => '`Talking Book` (1972) là album đánh dấu sự tự do nghệ thuật hoàn toàn của Stevie Wonder, nơi ông rũ bỏ hình ảnh "Little Stevie" để trở thành một nghệ sĩ trưởng thành đầy quyến rũ và sâu sắc. Album cân bằng hoàn hảo giữa những bản Funk hầm hố và những bản Ballad tình yêu mềm mại.

"Superstition" với đoạn riff Clavinet nổi tiếng nhất lịch sử là đỉnh cao của Funk Rock, trong khi "You Are the Sunshine of My Life" lại là một trong những bản tình ca đẹp nhất mọi thời đại. Album cho thấy khả năng giai điệu thiên bẩm và sự làm chủ phòng thu tuyệt đối của ông.

Bìa album với hình ảnh Stevie không đeo kính đen, nhìn xa xăm, thể hiện tâm hồn nhạy cảm của người nghệ sĩ. Đĩa than `Talking Book` mang lại chất âm mộc mạc, ấm áp của thập niên 70, là viên ngọc quý của dòng nhạc Soul.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 820000,
                'stock_quantity' => 28,
            ],
        ];

        foreach ($albums as $albumData) {
            // Calculate cost_price: 100,000 to 500,000 VND lower than selling price
            $priceReduction = rand(10, 50) * 10000;
            $costPrice = max(50000, $albumData['price'] - $priceReduction); // Ensure cost price is at least 50,000 VND

            Product::create([
                'name' => $albumData['name'],
                'image' => $albumData['image'],
                'slug' => Str::slug($albumData['name']),
                'description' => $albumData['description'],
                'detailed_description' => $albumData['detailed_description'] ?? null,
                'genre' => $albumData['genre'],
                'label' => $albumData['label'],
                'price' => $albumData['price'],
                'cost_price' => $costPrice,
                'stock_quantity' => $albumData['stock_quantity'],
                'status' => 'active',
            ]);
        }

        $this->command->info('Created 50 albums with detailed descriptions and VND prices');
    }
}
