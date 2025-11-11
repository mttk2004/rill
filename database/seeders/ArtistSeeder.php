<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 20 nghệ sĩ thật với tiểu sử chi tiết
        $artists = [
            // Nghệ sĩ nhạc vàng Việt Nam
            [
                'name' => 'Khánh Ly',
                'country' => 'Vietnam',
                'description' => 'Nữ ca sĩ huyền thoại của nhạc Việt, được mệnh danh là "Nữ hoàng nhạc Trịnh". Sinh năm 1945, bà là giọng ca chính thể hiện hầu hết các sáng tác của nhạc sĩ Trịnh Công Sơn.',
                'is_active' => true,
            ],
            [
                'name' => 'Trịnh Công Sơn',
                'country' => 'Vietnam',
                'description' => 'Nhạc sĩ, nhà thơ và họa sĩ Việt Nam (1939-2001). Ông là một trong những nhạc sĩ vĩ đại nhất của Việt Nam với hơn 600 sáng tác về tình yêu, chiến tranh và cuộc sống.',
                'is_active' => true,
            ],
            [
                'name' => 'Phạm Duy',
                'country' => 'Vietnam',
                'description' => 'Nhạc sĩ, ca sĩ người Việt Nam (1921-2013), được coi là một trong những người sáng lập nhạc Việt hiện đại. Ông có hơn 1000 tác phẩm thuộc nhiều thể loại khác nhau.',
                'is_active' => true,
            ],
            [
                'name' => 'Đàm Vĩnh Hưng',
                'country' => 'Vietnam',
                'description' => 'Ca sĩ nhạc trữ tình và pop Việt Nam sinh năm 1971, được mệnh danh là "Ông hoàng nhạc Việt". Anh nổi tiếng với giọng hát nội lực và phong cách biểu diễn đầy cảm xúc.',
                'is_active' => true,
            ],
            [
                'name' => 'Lam Trường',
                'country' => 'Vietnam',
                'description' => 'Ca sĩ người Việt Nam sinh năm 1974, một trong những gương mặt tiêu biểu của thế hệ nhạc trẻ những năm 1990. Anh được biết đến với giọng hát ngọt ngào và phong cách ballad.',
                'is_active' => true,
            ],

            // Nghệ sĩ quốc tế - Rock/Pop
            [
                'name' => 'The Beatles',
                'country' => 'United Kingdom',
                'description' => 'Ban nhạc rock huyền thoại từ Liverpool, Anh (1960-1970). Được coi là ban nhạc có ảnh hưởng nhất trong lịch sử nhạc đại chúng với các hit bất hủ như "Hey Jude", "Let It Be".',
                'is_active' => true,
            ],
            [
                'name' => 'Pink Floyd',
                'country' => 'United Kingdom',
                'description' => 'Ban nhạc rock tiến bộ người Anh thành lập năm 1965. Họ nổi tiếng với âm nhạc thực nghiệm, lời ca triết học và các buổi biểu diễn trực tiếp hoành tráng với hiệu ứng ánh sáng.',
                'is_active' => true,
            ],
            [
                'name' => 'Queen',
                'country' => 'United Kingdom',
                'description' => 'Ban nhạc rock Anh thành lập năm 1970 với giọng ca chính Freddie Mercury. Họ nổi tiếng với phong cách biểu diễn kịch tính và những ca khúc kinh điển như "Bohemian Rhapsody".',
                'is_active' => true,
            ],
            [
                'name' => 'Led Zeppelin',
                'country' => 'United Kingdom',
                'description' => 'Ban nhạc rock Anh thành lập năm 1968, được coi là một trong những nhóm nhạc có ảnh hưởng nhất. Họ là tiên phong của thể loại hard rock và heavy metal với "Stairway to Heaven".',
                'is_active' => true,
            ],
            [
                'name' => 'Nirvana',
                'country' => 'United States',
                'description' => 'Ban nhạc grunge từ Seattle, Washington (1987-1994) với giọng ca chính Kurt Cobain. Album "Nevermind" của họ đã thay đổi bộ mặt nhạc rock thập niên 1990 và phong trào grunge.',
                'is_active' => true,
            ],
            [
                'name' => 'Radiohead',
                'country' => 'United Kingdom',
                'description' => 'Ban nhạc rock thay thế từ Oxfordshire, Anh thành lập năm 1985. Họ được ca ngợi về khả năng đổi mới âm nhạc và tác động văn hóa với album "OK Computer" và "Kid A".',
                'is_active' => true,
            ],

            // Nghệ sĩ Jazz
            [
                'name' => 'Miles Davis',
                'country' => 'United States',
                'description' => 'Nhạc sĩ trumpet và nhà soạn nhạc jazz người Mỹ (1926-1991). Ông là một trong những nghệ sĩ jazz có ảnh hưởng nhất, tiên phong trong nhiều phong cách jazz như bebop, cool jazz.',
                'is_active' => true,
            ],
            [
                'name' => 'John Coltrane',
                'country' => 'United States',
                'description' => 'Nghệ sĩ saxophone và nhà soạn nhạc jazz người Mỹ (1926-1967). Ông là một trong những nghệ sĩ quan trọng nhất của jazz với album kinh điển "A Love Supreme" và phong cách độc đáo.',
                'is_active' => true,
            ],
            [
                'name' => 'Ella Fitzgerald',
                'country' => 'United States',
                'description' => 'Ca sĩ jazz người Mỹ (1917-1996), được mệnh danh là "Bà hoàng của Jazz". Bà nổi tiếng với giọng hát trong treo, khả năng scat singing tuyệt vời và giải âm ba octave.',
                'is_active' => true,
            ],
            [
                'name' => 'Louis Armstrong',
                'country' => 'United States',
                'description' => 'Nghệ sĩ trumpet và ca sĩ jazz người Mỹ (1901-1971). Ông là một trong những nghệ sĩ có ảnh hưởng lớn nhất trong lịch sử jazz với giọng hát trầm ấm đặc trưng và kỹ thuật trumpet xuất sắc.',
                'is_active' => true,
            ],

            // Nghệ sĩ Electronic
            [
                'name' => 'Kraftwerk',
                'country' => 'Germany',
                'description' => 'Ban nhạc electronic người Đức thành lập năm 1970 tại Düsseldorf. Họ là những người tiên phong của nhạc electronic hiện đại, ảnh hưởng đến synthpop, techno, hip hop và nhiều thể loại khác.',
                'is_active' => true,
            ],
            [
                'name' => 'Daft Punk',
                'country' => 'France',
                'description' => 'Bộ đôi nhạc electronic người Pháp thành lập năm 1993, nổi tiếng với hình tượng người máy. Họ đã tạo ra những album kinh điển như "Discovery" và "Random Access Memories".',
                'is_active' => true,
            ],
            [
                'name' => 'The Chemical Brothers',
                'country' => 'United Kingdom',
                'description' => 'Bộ đôi nhạc electronic người Anh thành lập năm 1989. Họ là những nghệ sĩ tiên phong của big beat và đã giành nhiều giải Grammy với phong cách kết hợp rock và electronic độc đáo.',
                'is_active' => true,
            ],

            // Nghệ sĩ R&B/Soul
            [
                'name' => 'Marvin Gaye',
                'country' => 'United States',
                'description' => 'Ca sĩ, nhạc sĩ người Mỹ (1939-1984), được mệnh danh là "Hoàng tử của Motown". Album "What\'s Going On" của ông được coi là một trong những album vĩ đại nhất mọi thời đại.',
                'is_active' => true,
            ],
            [
                'name' => 'Stevie Wonder',
                'country' => 'United States',
                'description' => 'Ca sĩ, nhạc sĩ đa nhạc cụ người Mỹ sinh năm 1950. Mặc dù mù từ nhỏ, ông đã trở thành một trong những nghệ sĩ thành công nhất với 25 giải Grammy và nhiều hit bất hủ.',
                'is_active' => true,
            ],
        ];

        foreach ($artists as $artistData) {
            Artist::create([
                'name' => $artistData['name'],
                'slug' => Str::slug($artistData['name']),
                'country' => $artistData['country'],
                'description' => $artistData['description'],
                'is_active' => $artistData['is_active'],
            ]);
        }

        $this->command->info('Created 20 artists with detailed biographies');
    }
}
