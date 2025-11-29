
import { Artist, Product, UserAddress, Collection, Review, Config, Order, CollectionItem, OrderStatusHistory, Payment, Voucher, User } from './types';

export const ARTISTS: Artist[] = [
  {
    id: "808596619145773056",
    name: "Trịnh Công Sơn",
    slug: "trinh-cong-son",
    description: "Nhạc sĩ, nhà thơ và họa sĩ Việt Nam (1939-2001).",
    country: "Việt Nam",
    image: null
  },
  {
    id: "808596619196104704",
    name: "The Beatles",
    slug: "the-beatles",
    description: "Ban nhạc rock huyền thoại từ Liverpool.",
    country: "Vương quốc Anh",
    image: "artists/kFvUu3EKhZ0OSIrm4TyvYzJ4Vrf4pW11IjEdWdbm.jpg"
  },
  {
    id: "808596619208687616",
    name: "Pink Floyd",
    slug: "pink-floyd",
    description: "Ban nhạc rock tiến bộ người Anh thành lập năm 1965.",
    country: "Vương quốc Anh",
    image: null
  },
  {
    id: "808596619128995840",
    name: "Khánh Ly",
    slug: "khanh-ly",
    description: "Nữ ca sĩ huyền thoại của nhạc Việt.",
    country: "Việt Nam",
    image: null
  },
  {
    id: "808596619372265472",
    name: "Stevie Wonder",
    slug: "stevie-wonder",
    description: "Ca sĩ, nhạc sĩ đa nhạc cụ người Mỹ.",
    country: "Hoa Kỳ",
    image: null
  },
  {
      id: "808596619259019264",
      name: "Radiohead",
      slug: "radiohead",
      description: "Ban nhạc rock thay thế từ Oxfordshire.",
      country: "Vương quốc Anh",
      image: null
  },
  {
      id: "808596619242242048",
      name: "Nirvana",
      slug: "nirvana",
      description: "Ban nhạc grunge từ Seattle.",
      country: "Hoa Kỳ",
      image: null
  },
  {
      id: "808596619338711040",
      name: "Daft Punk",
      slug: "daft-punk",
      description: "Bộ đôi nhạc electronic người Pháp.",
      country: "Pháp",
      image: null
  },
  {
      id: "808596619351293952",
      name: "The Chemical Brothers",
      slug: "the-chemical-brothers",
      description: "Bộ đôi nhạc electronic người Anh.",
      country: "Vương quốc Anh",
      image: null
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "808596619401625600",
    name: "Diễm Xưa",
    slug: "diem-xua",
    description: "Album tuyển tập những ca khúc bất hủ của nhạc sĩ Trịnh Công Sơn do Khánh Ly thể hiện.",
    detailed_description: "Diễm Xưa là một trong những tuyển tập tiêu biểu nhất của dòng nhạc Trịnh Công Sơn qua giọng hát Khánh Ly. Album không chỉ là tập hợp các ca khúc mà còn là một cuốn nhật ký bằng âm nhạc, ghi lại những rung động tinh tế.",
    sku: "VINYL-GD0EAFYE",
    price: "450000.00",
    stock_quantity: 25,
    genre: "Nhạc Trịnh",
    label: "Làng Văn",
    image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=1000&auto=format&fit=crop",
    artist_id: "808596619128995840",
    artists: [
      { artist_id: "808596619128995840", role: "main", sort_order: 0 },
      { artist_id: "808596619145773056", role: "composer", sort_order: 1 }
    ],
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "808596619472928768",
    name: "Abbey Road",
    slug: "abbey-road",
    description: "Album phòng thu thứ mười một và cũng là album cuối cùng được thu âm của The Beatles.",
    detailed_description: "Abbey Road là album phòng thu thứ mười một và cũng là lần cuối cùng bộ tứ huyền thoại The Beatles cùng nhau bước vào phòng thu. Bìa album với hình ảnh bốn thành viên đi qua vạch kẻ đường đã trở thành biểu tượng.",
    sku: "VINYL-JW0QQHYQ",
    price: "890000.00",
    stock_quantity: 35,
    genre: "Rock",
    label: "Apple Records",
    image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    artist_id: "808596619196104704",
    artists: [
      { artist_id: "808596619196104704", role: "main", sort_order: 0 }
    ],
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "808596619531649024",
    name: "The Dark Side of the Moon",
    slug: "the-dark-side-of-the-moon",
    description: "Album phòng thu thứ tám của Pink Floyd phát hành năm 1973.",
    detailed_description: "Không chỉ là một album, The Dark Side of the Moon là một cột mốc văn hóa. Pink Floyd đã dệt nên một tấm thảm âm thanh liền mạch, khám phá những áp lực của cuộc sống hiện đại.",
    sku: "VINYL-4S2LQH3Q",
    price: "920000.00",
    stock_quantity: 40,
    genre: "Progressive Rock",
    label: "Harvest Records",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    artist_id: "808596619208687616",
    artists: [
      { artist_id: "808596619208687616", role: "main", sort_order: 0 }
    ],
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "808596619967856640",
    name: "Innervisions",
    slug: "innervisions",
    description: "Album phòng thu thứ mười sáu của Stevie Wonder phát hành năm 1973.",
    detailed_description: "Innervisions (1973) là album tập trung, gai góc và mang tính chính trị nhất của Stevie Wonder. Album là cái nhìn sâu sắc vào nội tâm và thực trạng xã hội Mỹ thời bấy giờ.",
    sku: "VINYL-G0XM5SAP",
    price: "850000.00",
    stock_quantity: 26,
    genre: "Soul",
    label: "Tamla",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0f/Innervisions.jpg",
    artist_id: "808596619372265472",
    artists: [
      { artist_id: "808596619372265472", role: "main", sort_order: 0 }
    ],
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "808596619783307264",
    name: "OK Computer",
    slug: "ok-computer",
    description: "Album phòng thu thứ ba của Radiohead phát hành năm 1997.",
    detailed_description: "OK Computer (1997) thường được ví như Dark Side of the Moon của thế hệ Alternative Rock. Radiohead đã tạo ra một kiệt tác về nỗi lo âu trước sự bùng nổ của công nghệ.",
    sku: "VINYL-KCWLWKEZ",
    price: "890000.00",
    stock_quantity: 35,
    genre: "Alternative Rock",
    label: "Parlophone",
    image: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead_-_OK_Computer.png",
    artist_id: "808596619259019264",
    artists: [
      { artist_id: "808596619259019264", role: "main", sort_order: 0 }
    ]
  },
  {
    id: "808596619758141440",
    name: "Nevermind",
    slug: "nevermind",
    description: "Album phòng thu thứ hai của Nirvana phát hành năm 1991.",
    detailed_description: "Nevermind (1991) không chỉ là một album, nó là phát súng hiệu lệnh cho một cuộc cách mạng văn hóa. Nirvana đã đưa dòng nhạc Grunge từ những gara ẩm thấp ở Seattle ra ánh sáng.",
    sku: "VINYL-WZX5HBEF",
    price: "850000.00",
    stock_quantity: 45,
    genre: "Grunge",
    label: "DGC Records",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
    artist_id: "808596619242242048",
    artists: [
      { artist_id: "808596619242242048", role: "main", sort_order: 0 }
    ]
  },
  {
    id: "808596619867193344",
    name: "Random Access Memories",
    slug: "random-access-memories",
    description: "Album phòng thu thứ tư của Daft Punk phát hành năm 2013.",
    detailed_description: "Khi cả thế giới đang chạy theo EDM ồn ào, Daft Punk quay ngược 180 độ với Random Access Memories. Album là lời tri ân xa xỉ dành cho kỷ nguyên vàng của âm nhạc Analog.",
    sku: "VINYL-PBR8IEII",
    price: "950000.00",
    stock_quantity: 42,
    genre: "Electronic",
    label: "Columbia Records",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
    artist_id: "808596619338711040",
    artists: [
      { artist_id: "808596619338711040", role: "main", sort_order: 0 }
    ],
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "808596619456151552",
    name: "Nửa Vầng Trăng",
    slug: "nua-vang-trang",
    description: "Album tổng hợp các ca khúc trữ tình với giọng ca của nhiều nghệ sĩ nổi tiếng.",
    detailed_description: "Album Nửa Vầng Trăng là một tuyển tập đặc sắc quy tụ những giọng ca vàng của dòng nhạc trữ tình hải ngoại và trong nước thập niên 90 và đầu 2000.",
    sku: "VINYL-APUSCA2D",
    price: "350000.00",
    stock_quantity: 17,
    genre: "Nhạc Trữ Tình",
    label: "Thúy Nga",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    artist_id: undefined,
    artists: []
  },
  {
      id: "808596619418402816",
      name: "Tôi Sẽ Quay Về",
      slug: "toi-se-quay-ve",
      description: "Tuyển tập các ca khúc của Lam Trường với phong cách ballad đầy cảm xúc.",
      detailed_description: "Album Tôi Sẽ Quay Về là cột mốc quan trọng đánh dấu thời kỳ hoàng kim của Làn Sóng Xanh và sự nghiệp rực rỡ của Anh Hai Lam Trường.",
      sku: "VINYL-QCDZWVEQ",
      price: "380000.00",
      stock_quantity: 26,
      genre: "Nhạc Trẻ",
      label: "Vafaco",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
      artist_id: undefined,
      artists: []
  },
  {
      id: "808596619900747776",
      name: "Dig Your Own Hole",
      slug: "dig-your-own-hole",
      description: "Album phòng thu thứ hai của The Chemical Brothers phát hành năm 1997.",
      detailed_description: "Đỉnh cao của big beat. Với Block Rockin' Beats, Setting Sun, album này định hình electronic dance music thập niên 1990s.",
      sku: "VINYL-YSX7YWTM",
      price: "850000.00",
      stock_quantity: 25,
      genre: "Big Beat",
      label: "Freestyle Dust",
      image: "https://upload.wikimedia.org/wikipedia/en/e/eb/Dig_Your_Own_Hole.png",
      artist_id: "808596619351293952",
      artists: [
        { artist_id: "808596619351293952", role: "main", sort_order: 0 }
      ]
  }
];

export const ADDRESSES: UserAddress[] = [
  {
    id: "808596620747997184",
    user_id: "808596619099635712",
    full_name: "Nguyễn Văn Anh",
    phone: "0987654321",
    address_line_1: "123 Nguyễn Huệ",
    address_line_2: "Tòa nhà Times Square, Tầng 10",
    province: "Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    is_default: 1
  },
  {
    id: "808596620685082624",
    user_id: "808596619045109760",
    full_name: "Vũ Thị Phương",
    phone: "0956789012",
    address_line_1: "128 Nguyễn Trãi",
    address_line_2: "Chung cư Eurowindow, Tầng 15, Căn 1508",
    province: "Hà Nội",
    district: "Quận Thanh Xuân",
    ward: "Phường Thanh Xuân Trung",
    is_default: 0
  }
];

export const COLLECTIONS: Collection[] = [
  { 
    id: 1, 
    name: "Sản phẩm nổi bật", 
    slug: "san-pham-noi-bat", 
    type: "featured",
    description: "Các sản phẩm nổi bật được chọn lọc",
    is_active: 1,
    started_at: null,
    ended_at: null,
    display_order: 0
  },
  { 
    id: 2, 
    name: "Tuyển chọn đặc biệt", 
    slug: "tuyen-chon-dac-biet", 
    type: "curated",
    description: "Các sản phẩm đang được giảm giá",
    is_active: 1,
    started_at: null,
    ended_at: null,
    display_order: 1
  }
];

export const COLLECTION_ITEMS: CollectionItem[] = [
  { id: 1, collection_id: 1, product_id: "808596619472928768", position: 0 },
  { id: 2, collection_id: 1, product_id: "808596619531649024", position: 1 },
  { id: 3, collection_id: 1, product_id: "808596619783307264", position: 2 },
  { id: 4, collection_id: 1, product_id: "808596619867193344", position: 3 },
  { id: 5, collection_id: 1, product_id: "808596619401625600", position: 4 },
  { id: 6, collection_id: 2, product_id: "808596619967856640", position: 0 },
  { id: 7, collection_id: 2, product_id: "808596619758141440", position: 1 },
  { id: 8, collection_id: 2, product_id: "808596619456151552", position: 2 },
  { id: 9, collection_id: 2, product_id: "808596619900747776", position: 3 },
];

export const REVIEWS: Review[] = [
  {
    id: "808596620949323776",
    product_id: "808596619900747776",
    user_id: "808596619070275584",
    user_name: "Bùi Thanh Hằng",
    rating: 5,
    comment: "Đĩa nhạc chất lượng xuất sắc! Âm thanh trong trẻo, đóng gói rất cẩn thận. Shop phục vụ nhiệt tình, giao hàng nhanh. Sẽ tiếp tục ủng hộ!",
    created_at: "2025-11-04 07:14:17"
  },
  {
    id: "808627882786619392",
    product_id: "808596619472928768",
    user_id: "808596618978000896",
    user_name: "Nguyễn Văn Anh",
    rating: 4,
    comment: "Sản phẩm tốt, giao hàng đúng hẹn. Tuy nhiên hộp hơi móp một chút ở góc.",
    created_at: "2025-11-18 09:18:30"
  },
  {
    id: "808628523909664768",
    product_id: "808596619783307264",
    user_id: "808596618978000896",
    user_name: "Nguyễn Văn Anh",
    rating: 5,
    comment: "Một kiệt tác của Radiohead. Bản in vinyl nghe rất chi tiết, không gian rộng mở. Rất đáng tiền.",
    created_at: "2025-11-18 09:21:03"
  }
];

export const CONFIGS: Config[] = [
  {
    id: 1,
    key: "banner_enabled",
    value: "1",
    type: "boolean",
    group: "banner",
    label: "Bật/Tắt Banner đầu trang"
  },
  {
    id: 2,
    key: "banner_content",
    value: "Chào mừng bạn đến với Rill - Cửa hàng đĩa than chuyên nghiệp số 2 Việt Nam!",
    type: "text",
    group: "banner",
    label: "Nội dung Banner"
  },
  {
    id: 3,
    key: "banner_type",
    value: "success",
    type: "text",
    group: "banner",
    label: "Kiểu Banner (info/success/warning)"
  },
  {
    id: 4,
    key: "shipping_free_threshold",
    value: "3000000",
    type: "number",
    group: "shipping",
    label: "Mức giá tối thiểu để Free Ship (VNĐ)"
  },
  {
    id: 5,
    key: "shipping_estimate_min_days",
    value: "2",
    type: "number",
    group: "shipping",
    label: "Thời gian giao hàng tối thiểu (ngày)"
  },
  {
    id: 6,
    key: "shipping_estimate_max_days",
    value: "5",
    type: "number",
    group: "shipping",
    label: "Thời gian giao hàng tối đa (ngày)"
  },
  {
    id: 7,
    key: "return_policy_days",
    value: "7",
    type: "number",
    group: "policy",
    label: "Thời gian đổi trả (ngày)"
  },
  {
    id: 8,
    key: "return_policy_condition",
    value: "lỗi nhà sản xuất",
    type: "text",
    group: "policy",
    label: "Điều kiện đổi trả"
  }
];

export const ORDER_STATUS_HISTORIES: OrderStatusHistory[] = [
  { id: "h1", order_id: "808596620806717440", status: "pending", notes: "Đơn hàng mới được tạo", created_by: null, created_at: "2025-02-28 14:30:00" },
  { id: "h2", order_id: "808596620806717440", status: "confirmed", notes: "Đã xác nhận đơn hàng", created_by: "808596618944446464", created_at: "2025-02-28 15:00:00" },
  { id: "h3", order_id: "808596620806717440", status: "shipped", notes: "Giao cho đơn vị vận chuyển", created_by: "808596618944446464", created_at: "2025-03-01 09:30:00" },
];

export const PAYMENTS: Payment[] = [
  { 
    id: "p1", 
    order_id: "808596620806717440", 
    payment_method: "cod", 
    payment_status: "pending", 
    amount: 1840000, 
    currency: "VND", 
    transaction_id: null, 
    gateway_response: null, 
    processed_at: null, 
    created_at: "2025-02-28 14:30:00" 
  },
  { 
    id: "p2", 
    order_id: "808596620903186432", 
    payment_method: "vnpay", 
    payment_status: "completed", 
    amount: 485000, 
    currency: "VND", 
    transaction_id: "VNP88293392", 
    gateway_response: "{\"responseCode\": \"00\"}", 
    processed_at: "2025-01-15 09:15:00", 
    created_at: "2025-01-15 09:15:00" 
  }
];

export const ORDERS: Order[] = [
  {
    id: "808596620806717440",
    order_number: "ORD-2025-001",
    user_id: "808596618978000896",
    created_at: "2025-02-28 14:30:00",
    placed_at: "2025-02-28 14:30:00",
    updated_at: "2025-03-01 09:30:00",
    status: "shipped",
    subtotal: 1810000,
    total_amount: 1845000,
    shipping_fee: 35000,
    discount_amount: 0,
    notes: "Giao hàng trong giờ hành chính",
    shipping_address: ADDRESSES[0],
    items: [
      {
        id: "i1",
        order_id: "808596620806717440",
        product_id: "808596619472928768",
        product_name: "Abbey Road",
        product_sku: "VINYL-JW0QQHYQ",
        product_image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        quantity: 1,
        unit_price: 890000,
        total_price: 890000
      },
       {
        id: "i2",
        order_id: "808596620806717440",
        product_id: "808596619531649024",
        product_name: "The Dark Side of the Moon",
        product_sku: "VINYL-4S2LQH3Q",
        product_image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        quantity: 1,
        unit_price: 920000,
        total_price: 920000
      }
    ],
    histories: ORDER_STATUS_HISTORIES,
    payment: PAYMENTS[0]
  },
  {
    id: "808596620903186432",
    order_number: "ORD-2025-002",
    user_id: "808596618978000896",
    created_at: "2025-01-15 09:15:00",
    placed_at: "2025-01-15 09:15:00",
    updated_at: "2025-01-18 10:00:00",
    status: "delivered",
    subtotal: 450000,
    total_amount: 485000,
    shipping_fee: 35000,
    discount_amount: 0,
    notes: null,
    shipping_address: ADDRESSES[0],
    items: [
      {
        id: "i3",
        order_id: "808596620903186432",
        product_id: "808596619401625600",
        product_name: "Diễm Xưa",
        product_sku: "VINYL-GD0EAFYE",
        product_image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=1000&auto=format&fit=crop",
        quantity: 1,
        unit_price: 450000,
        total_price: 450000
      }
    ],
    histories: [],
    payment: PAYMENTS[1]
  }
];

export const VOUCHERS: Voucher[] = [
  {
    id: "808596621305839616",
    code: "RILLNEW",
    name: "Chào mừng khách hàng mới",
    description: "Giảm giá 100K cho khách hàng mới đăng ký tài khoản",
    type: "fixed",
    value: 100000.00,
    minimum_amount: 0.00,
    maximum_discount: null,
    usage_limit: null,
    used_count: 1,
    usage_limit_per_user: 1,
    valid_from: "2025-11-18 07:14:17",
    valid_to: "2026-11-18 07:14:17",
    is_active: 1,
    created_at: "2025-11-18 07:14:17",
    updated_at: "2025-11-24 08:02:22"
  },
  {
    id: "v2",
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    description: "Miễn phí vận chuyển cho đơn từ 500k",
    type: "fixed",
    value: 35000,
    minimum_amount: 500000,
    maximum_discount: null,
    usage_limit: 500,
    used_count: 500,
    usage_limit_per_user: 2,
    valid_from: "2024-06-01 00:00:00",
    valid_to: "2024-08-31 23:59:59",
    is_active: 0,
    created_at: "2024-05-20 10:00:00"
  },
  {
    id: "v3",
    code: "VINYLLOVER",
    name: "Ưu đãi thành viên VIP",
    description: "Giảm 5% cho đơn từ 1 triệu",
    type: "percentage",
    value: 5,
    minimum_amount: 1000000,
    maximum_discount: 100000,
    usage_limit: 200,
    used_count: 45,
    usage_limit_per_user: 1,
    valid_from: "2025-01-01 00:00:00",
    valid_to: "2025-06-30 23:59:59",
    is_active: 1,
    created_at: "2025-01-01 08:00:00"
  }
];

export const USERS: User[] = [
  {
    id: "808596618944446464",
    name: "Admin User",
    email: "admin@rill.local",
    email_verified_at: "2024-01-01 00:00:00",
    role: "admin",
    phone: "0900000000",
    gender: "male",
    date_of_birth: "1990-01-01",
    avatar: null,
    is_active: 1,
    created_at: "2024-01-01 00:00:00"
  },
  {
    id: "808596618978000896",
    name: "Nguyễn Văn Anh",
    email: "nguyenvana@example.com",
    email_verified_at: "2025-01-01 10:00:00",
    role: "customer",
    phone: "0987654321",
    gender: "male",
    date_of_birth: "1995-05-15",
    avatar: "https://i.pravatar.cc/150?u=808596618978000896",
    is_active: 1,
    created_at: "2025-01-01 10:00:00"
  },
  {
    id: "808596619045109760",
    name: "Vũ Thị Phương",
    email: "phuongvu@example.com",
    email_verified_at: null,
    role: "customer",
    phone: "0956789012",
    gender: "female",
    date_of_birth: "1998-08-20",
    avatar: null,
    is_active: 1,
    created_at: "2025-02-15 14:30:00"
  }
];
