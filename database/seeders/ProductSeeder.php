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
                'description' => 'Album tuyển tập những ca khúc bất hủ của nhạc sĩ Trịnh Công Sơn do Khánh Ly thể hiện. Bao gồm các tác phẩm như "Diễm Xưa", "Biển Nhớ", "Nối Vòng Tay Lớn" - những sáng tác đi vào lòng người Việt.',
                'genre' => 'Nhạc Trịnh',
                'label' => 'Làng Văn',
                'price' => 450000,
                'is_featured' => true,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Tôi Sẽ Quay Về',
                'description' => 'Tuyển tập các ca khúc của Lam Trường với phong cách ballad đầy cảm xúc, đánh dấu thời kỳ hoàng kim của nhạc trẻ Việt Nam cuối thập niên 1990. Album bao gồm "Tình Thôi Xót Xa", "Tình Ca Không Quên".',
                'genre' => 'Nhạc Trẻ',
                'label' => 'Vafaco',
                'price' => 380000,
                'is_featured' => true,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Đàm Vĩnh Hưng & Những Tình Khúc Bất Hủ',
                'description' => 'Album tuyển chọn những ca khúc kinh điển được Đàm Vĩnh Hưng thể hiện lại với phong cách độc đáo. Bao gồm "Biển Tình", "Xin Lỗi Tình Yêu", mang đến cảm xúc sâu lắng cho người nghe.',
                'genre' => 'Nhạc Trữ Tình',
                'label' => 'TNCD',
                'price' => 420000,
                'is_featured' => true,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Tình Ca Phạm Duy',
                'description' => 'Tuyển tập những tình ca bất hủ của nhạc sĩ Phạm Duy, ghi dấu một thời kỳ vàng son của âm nhạc Việt Nam. Các ca khúc như "Tình Ca", "Cỏ Úa" được trình bày với đầy cảm xúc.',
                'genre' => 'Tân Cổ',
                'label' => 'Phạm Duy Music',
                'price' => 480000,
                'is_featured' => false,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'Nửa Vầng Trăng',
                'description' => 'Album tổng hợp các ca khúc trữ tình với giọng ca của nhiều nghệ sĩ nổi tiếng thập niên 1990s, bao gồm "Nửa Vầng Trăng", "Mưa Rơi Lặng Thầm", mang đến không khí hoài niệm.',
                'genre' => 'Nhạc Trữ Tình',
                'label' => 'Thúy Nga',
                'price' => 350000,
                'is_featured' => false,
                'stock_quantity' => 18,
            ],

            // The Beatles
            [
                'name' => 'Abbey Road',
                'description' => 'Album phòng thu thứ mười một và cũng là album cuối cùng được thu âm của The Beatles, phát hành năm 1969. Được đánh giá là một trong những album vĩ đại nhất mọi thời đại với "Come Together", "Something", "Here Comes the Sun".',
                'genre' => 'Rock',
                'label' => 'Apple Records',
                'price' => 890000,
                'is_featured' => true,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Sgt. Pepper\'s Lonely Hearts Club Band',
                'description' => 'Album phòng thu thứ tám của The Beatles phát hành năm 1967, được coi là album có ảnh hưởng nhất trong lịch sử nhạc rock. Một kiệt tác của nhạc psychedelic rock với "Lucy in the Sky with Diamonds", "A Day in the Life".',
                'genre' => 'Psychedelic Rock',
                'label' => 'Parlophone',
                'price' => 950000,
                'is_featured' => true,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'Revolver',
                'description' => 'Album phòng thu thứ bảy của The Beatles phát hành năm 1966, đánh dấu sự chuyển mình trong âm nhạc của ban nhạc. Bao gồm các ca khúc nổi tiếng như "Eleanor Rigby", "Yellow Submarine", "Tomorrow Never Knows".',
                'genre' => 'Rock',
                'label' => 'Parlophone',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'The Beatles (White Album)',
                'description' => 'Album kép thứ chín của The Beatles phát hành năm 1968, nổi tiếng với bìa album trắng tinh khiết. Một tác phẩm đa dạng với 30 ca khúc thuộc nhiều thể loại khác nhau, từ rock đến folk.',
                'genre' => 'Rock',
                'label' => 'Apple Records',
                'price' => 1200000,
                'is_featured' => false,
                'stock_quantity' => 20,
            ],

            // Pink Floyd
            [
                'name' => 'The Dark Side of the Moon',
                'description' => 'Album phòng thu thứ tám của Pink Floyd phát hành năm 1973, một trong những album bán chạy nhất mọi thời đại. Khám phá các chủ đề về xung đột, tham lam, thời gian và bệnh tâm thần qua âm nhạc progressive rock tuyệt vời.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 920000,
                'is_featured' => true,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'The Wall',
                'description' => 'Album kép phòng thu thứ mười một của Pink Floyd phát hành năm 1979, một rock opera kể về nhân vật Pink. Bao gồm các hit như "Another Brick in the Wall Part 2", "Comfortably Numb", một kiệt tác về sự cô lập.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 1100000,
                'is_featured' => true,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Wish You Were Here',
                'description' => 'Album phòng thu thứ chín của Pink Floyd phát hành năm 1975, là lời tri ân cho thành viên sáng lập Syd Barrett. Album gồm các tác phẩm nổi tiếng như "Shine On You Crazy Diamond", "Wish You Were Here".',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 880000,
                'is_featured' => false,
                'stock_quantity' => 25,
            ],

            // Led Zeppelin
            [
                'name' => 'Led Zeppelin IV',
                'description' => 'Album phòng thu thứ tư của Led Zeppelin phát hành năm 1971, bao gồm ca khúc huyền thoại "Stairway to Heaven". Được coi là một trong những album rock vĩ đại nhất với sự kết hợp hoàn hảo giữa hard rock, folk và blues.',
                'genre' => 'Hard Rock',
                'label' => 'Atlantic Records',
                'price' => 890000,
                'is_featured' => true,
                'stock_quantity' => 32,
            ],
            [
                'name' => 'Physical Graffiti',
                'description' => 'Album kép thứ sáu của Led Zeppelin phát hành năm 1975, cho thấy sự đa dạng trong phong cách âm nhạc của ban nhạc. Bao gồm "Kashmir", "Trampled Under Foot", một tác phẩm đồ sộ của hard rock.',
                'genre' => 'Hard Rock',
                'label' => 'Swan Song',
                'price' => 1150000,
                'is_featured' => false,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Led Zeppelin II',
                'description' => 'Album phòng thu thứ hai của Led Zeppelin phát hành năm 1969, củng cố vị thế của họ trong làng nhạc rock. Với các bản hit như "Whole Lotta Love", "Ramble On", album này định hình hard rock và heavy metal.',
                'genre' => 'Hard Rock',
                'label' => 'Atlantic Records',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 28,
            ],

            // Queen
            [
                'name' => 'A Night at the Opera',
                'description' => 'Album phòng thu thứ tư của Queen phát hành năm 1975, bao gồm ca khúc huyền thoại "Bohemian Rhapsody". Một kiệt tác của rock opera với sự kết hợp độc đáo giữa rock, opera và progressive.',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 920000,
                'is_featured' => true,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'News of the World',
                'description' => 'Album phòng thu thứ sáu của Queen phát hành năm 1977, bao gồm hai anthem rock vĩ đại "We Will Rock You" và "We Are the Champions". Album này đã trở thành biểu tượng của văn hóa thể thao toàn cầu.',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 880000,
                'is_featured' => true,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'The Game',
                'description' => 'Album phòng thu thứ tám của Queen phát hành năm 1980, đánh dấu sự chuyển hướng sang funk và disco. Bao gồm các hit "Another One Bites the Dust", "Crazy Little Thing Called Love".',
                'genre' => 'Rock',
                'label' => 'EMI',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 24,
            ],

            // Miles Davis - Jazz
            [
                'name' => 'Kind of Blue',
                'description' => 'Album jazz kinh điển của Miles Davis phát hành năm 1959, được coi là album jazz vĩ đại nhất mọi thời đại. Với sự tham gia của John Coltrane, Bill Evans, album này định nghĩa modal jazz và đã bán được hàng triệu bản.',
                'genre' => 'Jazz',
                'label' => 'Columbia Records',
                'price' => 790000,
                'is_featured' => true,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Sketches of Spain',
                'description' => 'Album của Miles Davis phát hành năm 1960, kết hợp jazz với âm nhạc cổ điển Tây Ban Nha. Được phối khí bởi Gil Evans, đây là một trong những album jazz orchestral đẹp nhất từng được thu âm.',
                'genre' => 'Jazz',
                'label' => 'Columbia Records',
                'price' => 750000,
                'is_featured' => false,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Bitches Brew',
                'description' => 'Album đột phá của Miles Davis phát hành năm 1970, khởi đầu kỷ nguyên jazz fusion. Kết hợp jazz với rock, funk và electronic, album này đã mở ra hướng đi mới cho jazz hiện đại.',
                'genre' => 'Jazz Fusion',
                'label' => 'Columbia Records',
                'price' => 1200000,
                'is_featured' => false,
                'stock_quantity' => 15,
            ],

            // John Coltrane
            [
                'name' => 'A Love Supreme',
                'description' => 'Album jazz tâm linh của John Coltrane phát hành năm 1965, được coi là kiệt tác của ông. Một tác phẩm bốn phần thể hiện hành trình tâm linh, đây là một trong những album jazz quan trọng và có ảnh hưởng nhất.',
                'genre' => 'Jazz',
                'label' => 'Impulse!',
                'price' => 820000,
                'is_featured' => true,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Blue Train',
                'description' => 'Album phòng thu của John Coltrane phát hành năm 1957, đánh dấu debut của ông với Blue Note Records. Một album hard bop kinh điển với ca khúc chủ đề "Blue Train" và sự tham gia của Lee Morgan.',
                'genre' => 'Jazz',
                'label' => 'Blue Note',
                'price' => 780000,
                'is_featured' => false,
                'stock_quantity' => 22,
            ],

            // Ella Fitzgerald
            [
                'name' => 'Ella Fitzgerald Sings the Cole Porter Song Book',
                'description' => 'Album của Ella Fitzgerald phát hành năm 1956, là phần đầu tiên trong series Song Books. Bà thể hiện các tác phẩm của Cole Porter với giọng hát trong trẻo và kỹ thuật hoàn hảo.',
                'genre' => 'Jazz Vocal',
                'label' => 'Verve',
                'price' => 750000,
                'is_featured' => false,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Ella and Louis',
                'description' => 'Album hợp tác giữa Ella Fitzgerald và Louis Armstrong phát hành năm 1956. Sự kết hợp giữa giọng soprano tinh khiết của Ella và giọng gravelly của Louis tạo nên một album jazz vocal bất hủ.',
                'genre' => 'Jazz Vocal',
                'label' => 'Verve',
                'price' => 820000,
                'is_featured' => true,
                'stock_quantity' => 20,
            ],

            // Louis Armstrong
            [
                'name' => 'Hello, Dolly!',
                'description' => 'Album của Louis Armstrong phát hành năm 1964, với ca khúc chủ đề cùng tên đã đánh bại Beatles trên bảng xếp hạng Billboard. Một album showcase giọng hát ấm áp và trumpet tuyệt vời của Satchmo.',
                'genre' => 'Jazz',
                'label' => 'Kapp Records',
                'price' => 680000,
                'is_featured' => false,
                'stock_quantity' => 25,
            ],

            // Nirvana
            [
                'name' => 'Nevermind',
                'description' => 'Album phòng thu thứ hai của Nirvana phát hành năm 1991, đã thay đổi bộ mặt nhạc rock và đưa grunge vào mainstream. Với "Smells Like Teen Spirit", album này trở thành biểu tượng của thế hệ Generation X.',
                'genre' => 'Grunge',
                'label' => 'DGC Records',
                'price' => 850000,
                'is_featured' => true,
                'stock_quantity' => 45,
            ],
            [
                'name' => 'In Utero',
                'description' => 'Album phòng thu thứ ba và cuối cùng của Nirvana phát hành năm 1993, thô ráp và trực diện hơn Nevermind. Album thể hiện sự giằng xé nội tâm của Kurt Cobain với các ca khúc như "Heart-Shaped Box".',
                'genre' => 'Grunge',
                'label' => 'DGC Records',
                'price' => 880000,
                'is_featured' => false,
                'stock_quantity' => 30,
            ],

            // Radiohead
            [
                'name' => 'OK Computer',
                'description' => 'Album phòng thu thứ ba của Radiohead phát hành năm 1997, một kiệt tác của alternative rock. Album khám phá alienation trong thời đại hiện đại với các ca khúc như "Paranoid Android", "Karma Police", "No Surprises".',
                'genre' => 'Alternative Rock',
                'label' => 'Parlophone',
                'price' => 890000,
                'is_featured' => true,
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Kid A',
                'description' => 'Album phòng thu thứ tư của Radiohead phát hành năm 2000, đánh dấu sự chuyển hướng radical sang electronic và experimental. Một album đầy thách thức và đổi mới, định hình rock thập kỷ 2000.',
                'genre' => 'Electronic Rock',
                'label' => 'Parlophone',
                'price' => 920000,
                'is_featured' => false,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'In Rainbows',
                'description' => 'Album phòng thu thứ bảy của Radiohead phát hành năm 2007, nổi tiếng với mô hình phát hành "pay what you want". Album kết hợp electronic với rock truyền thống, được đánh giá là một trong những album hay nhất của họ.',
                'genre' => 'Alternative Rock',
                'label' => 'Self-released',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 32,
            ],

            // Kraftwerk
            [
                'name' => 'Trans-Europe Express',
                'description' => 'Album thứ sáu của Kraftwerk phát hành năm 1977, một tác phẩm tiên phong của electronic music. Album lấy cảm hứng từ hành trình tàu hỏa xuyên châu Âu, đã ảnh hưởng sâu rộng đến hip hop và techno.',
                'genre' => 'Electronic',
                'label' => 'Kling Klang',
                'price' => 820000,
                'is_featured' => true,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'The Man-Machine',
                'description' => 'Album thứ bảy của Kraftwerk phát hành năm 1978, khám phá mối quan hệ giữa con người và công nghệ. Với các ca khúc như "The Robots", "The Model", album này định hình synthpop và new wave.',
                'genre' => 'Electronic',
                'label' => 'Kling Klang',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Autobahn',
                'description' => 'Album thứ tư của Kraftwerk phát hành năm 1974, đánh dấu sự chuyển mình sang electronic music hoàn toàn. Ca khúc chủ đề dài 22 phút mô phỏng hành trình trên đường cao tốc, một đột phá trong âm nhạc electronic.',
                'genre' => 'Electronic',
                'label' => 'Philips',
                'price' => 790000,
                'is_featured' => false,
                'stock_quantity' => 18,
            ],

            // Daft Punk
            [
                'name' => 'Discovery',
                'description' => 'Album phòng thu thứ hai của Daft Punk phát hành năm 2001, kết hợp house, disco, rock và synthpop. Với các hit như "One More Time", "Harder Better Faster Stronger", album này định nghĩa French house.',
                'genre' => 'Electronic',
                'label' => 'Virgin Records',
                'price' => 880000,
                'is_featured' => true,
                'stock_quantity' => 38,
            ],
            [
                'name' => 'Random Access Memories',
                'description' => 'Album phòng thu thứ tư của Daft Punk phát hành năm 2013, tribute đến disco và soft rock thập niên 1970s-80s. Với "Get Lucky" featuring Pharrell Williams, album này giành Album of the Year tại Grammy.',
                'genre' => 'Electronic',
                'label' => 'Columbia Records',
                'price' => 950000,
                'is_featured' => true,
                'stock_quantity' => 42,
            ],
            [
                'name' => 'Homework',
                'description' => 'Album debut của Daft Punk phát hành năm 1997, giới thiệu French house đến thế giới. Với các ca khúc như "Around the World", "Da Funk", album này đặt nền móng cho career huyền thoại của bộ đôi.',
                'genre' => 'Electronic',
                'label' => 'Virgin Records',
                'price' => 820000,
                'is_featured' => false,
                'stock_quantity' => 30,
            ],

            // The Chemical Brothers
            [
                'name' => 'Dig Your Own Hole',
                'description' => 'Album phòng thu thứ hai của The Chemical Brothers phát hành năm 1997, đỉnh cao của big beat. Với "Block Rockin\' Beats", "Setting Sun", album này định hình electronic dance music thập niên 1990s.',
                'genre' => 'Big Beat',
                'label' => 'Freestyle Dust',
                'price' => 850000,
                'is_featured' => true,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Surrender',
                'description' => 'Album phòng thu thứ ba của The Chemical Brothers phát hành năm 1999, tiếp tục khai thác big beat với sự tinh tế hơn. Bao gồm "Hey Boy Hey Girl", "Let Forever Be" với sự góp giọng của Noel Gallagher.',
                'genre' => 'Big Beat',
                'label' => 'Freestyle Dust',
                'price' => 880000,
                'is_featured' => false,
                'stock_quantity' => 22,
            ],

            // Marvin Gaye
            [
                'name' => 'What\'s Going On',
                'description' => 'Album phòng thu thứ mười một của Marvin Gaye phát hành năm 1971, một concept album về các vấn đề xã hội. Được coi là một trong những album vĩ đại nhất, với ca khúc chủ đề và "Mercy Mercy Me".',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 820000,
                'is_featured' => true,
                'stock_quantity' => 28,
            ],
            [
                'name' => 'Let\'s Get It On',
                'description' => 'Album phòng thu thứ mười ba của Marvin Gaye phát hành năm 1973, một album sensual về tình yêu và sexuality. Ca khúc chủ đề trở thành một trong những love song mang tính biểu tượng nhất.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 780000,
                'is_featured' => false,
                'stock_quantity' => 24,
            ],

            // Stevie Wonder
            [
                'name' => 'Songs in the Key of Life',
                'description' => 'Album kép của Stevie Wonder phát hành năm 1976, được coi là kiệt tác của ông. Một tác phẩm đồ sộ với 21 ca khúc khám phá tình yêu, tâm linh và công bằng xã hội, giành Album of the Year tại Grammy.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 1150000,
                'is_featured' => true,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Innervisions',
                'description' => 'Album phòng thu thứ mười sáu của Stevie Wonder phát hành năm 1973, khám phá các vấn đề xã hội và tâm linh. Với "Living for the City", "Higher Ground", album này giành Grammy Album of the Year.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 850000,
                'is_featured' => false,
                'stock_quantity' => 26,
            ],
            [
                'name' => 'Talking Book',
                'description' => 'Album phòng thu thứ mười lăm của Stevie Wonder phát hành năm 1972, bao gồm hai hit lớn "Superstition" và "You Are the Sunshine of My Life". Album đánh dấu thời kỳ hoàng kim của ông.',
                'genre' => 'Soul',
                'label' => 'Tamla',
                'price' => 820000,
                'is_featured' => false,
                'stock_quantity' => 28,
            ],
        ];

        foreach ($albums as $albumData) {
            Product::create([
                'name' => $albumData['name'],
                'slug' => Str::slug($albumData['name']),
                'description' => $albumData['description'],
                'genre' => $albumData['genre'],
                'label' => $albumData['label'],
                'price' => $albumData['price'],
                'is_featured' => $albumData['is_featured'],
                'stock_quantity' => $albumData['stock_quantity'],
                'status' => 'active',
            ]);
        }

        $this->command->info('Created 50 albums with detailed descriptions and VND prices');
    }
}
