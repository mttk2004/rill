import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { Head } from "@inertiajs/react";

const AdminProducts = () => {

  const products = [
    {
      id: 1,
      name: "Abbey Road",
      slug: "abbey-road",
      description: "Album huyền thoại cuối cùng của The Beatles được thu âm tại studio",
      detailed_description: "Abbey Road là album phòng thu cuối cùng của ban nhạc rock Anh The Beatles, được phát hành vào ngày 26 tháng 9 năm 1969.",
      sku: "VNL-BEAT-001",
      price: 1250000,
      cost_price: 800000,
      compare_price: 1400000,
      stock_quantity: 25,
      min_stock_level: 5,
      genre: "Rock",
      label: "Apple Records",
      image: "/placeholder-vinyl.jpg",
      is_featured: true,
      status: "active",
      artists: [
        { id: 1, name: "The Beatles", slug: "the-beatles", role: "main" },
      ],
      total_sold: 45,
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      name: "The Dark Side of the Moon",
      slug: "dark-side-of-the-moon",
      description: "Album concept kinh điển về tâm lý học và triết học từ Pink Floyd",
      detailed_description: "The Dark Side of the Moon là album phòng thu thứ tám của ban nhạc rock Anh Pink Floyd, được phát hành vào ngày 1 tháng 3 năm 1973.",
      sku: "VNL-PINK-001",
      price: 980000,
      cost_price: 650000,
      compare_price: 1200000,
      stock_quantity: 0,
      min_stock_level: 3,
      genre: "Progressive Rock",
      label: "Harvest Records",
      image: "/placeholder-vinyl.jpg",
      is_featured: true,
      status: "out_of_stock",
      artists: [
        { id: 2, name: "Pink Floyd", slug: "pink-floyd", role: "main" },
      ],
      total_sold: 38,
      created_at: "2024-01-08T09:30:00Z",
      updated_at: "2024-01-18T16:45:00Z"
    },
    {
      id: 3,
      name: "Thriller",
      slug: "thriller",
      description: "Album pop kinh điển nhất mọi thời đại từ Vua nhạc pop Michael Jackson",
      detailed_description: "Thriller là album phòng thu thứ sáu của ca sĩ người Mỹ Michael Jackson, được phát hành vào ngày 30 tháng 11 năm 1982.",
      sku: "VNL-MJ-001",
      price: 1100000,
      cost_price: 750000,
      compare_price: null,
      stock_quantity: 15,
      min_stock_level: 8,
      genre: "Pop",
      label: "Epic Records",
      image: "/placeholder-vinyl.jpg",
      is_featured: false,
      status: "active",
      artists: [
        { id: 3, name: "Michael Jackson", slug: "michael-jackson", role: "main" },
        { id: 4, name: "Quincy Jones", slug: "quincy-jones", role: "producer" },
      ],
      total_sold: 32,
      created_at: "2024-01-05T10:15:00Z",
      updated_at: "2024-01-15T12:20:00Z"
    },
    {
      id: 4,
      name: "Hotel California",
      slug: "hotel-california",
      description: "Album rock kinh điển với ca khúc cùng tên nổi tiếng thế giới",
      detailed_description: "Hotel California là album phòng thu thứ năm của ban nhạc rock Mỹ Eagles, được phát hành vào ngày 8 tháng 12 năm 1976.",
      sku: "VNL-EAG-001",
      price: 1350000,
      cost_price: 900000,
      compare_price: 1500000,
      stock_quantity: 8,
      min_stock_level: 10,
      genre: "Rock",
      label: "Asylum Records",
      image: "/placeholder-vinyl.jpg",
      is_featured: true,
      status: "active",
      artists: [
        { id: 5, name: "Eagles", slug: "eagles", role: "main" },
      ],
      total_sold: 28,
      created_at: "2024-01-03T14:20:00Z",
      updated_at: "2024-01-12T09:10:00Z"
    },
    {
      id: 5,
      name: "The Wall",
      slug: "the-wall",
      description: "Album rock opera hoành tráng về sự cô lập và áp lực xã hội",
      detailed_description: "The Wall là album phòng thu thứ mười một của ban nhạc rock Anh Pink Floyd, được phát hành vào ngày 30 tháng 11 năm 1979.",
      sku: "VNL-PINK-002",
      price: 1450000,
      cost_price: 950000,
      compare_price: 1600000,
      stock_quantity: 20,
      min_stock_level: 5,
      genre: "Progressive Rock",
      label: "Harvest Records",
      image: "/placeholder-vinyl.jpg",
      is_featured: false,
      status: "inactive",
      artists: [
        { id: 2, name: "Pink Floyd", slug: "pink-floyd", role: "main" },
      ],
      total_sold: 22,
      created_at: "2024-01-01T16:00:00Z",
      updated_at: "2024-01-10T11:30:00Z"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Đang bán", color: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0" },
      inactive: { variant: "secondary" as const, label: "Không hoạt động", color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0" },
      out_of_stock: { variant: "destructive" as const, label: "Hết hàng", color: "bg-gradient-to-r from-red-500 to-red-600 text-white border-0" },
    };

    const config = variants[status as keyof typeof variants] || variants.inactive;
    return (
      <Badge
        variant={config.variant}
        className={config.color}
      >
        {config.label}
      </Badge>
    );
  };

  const calculateProfit = (price: number, cost_price: number | null) => {
    if (!cost_price || cost_price === 0) return "N/A";
    const profit = ((price - cost_price) / cost_price * 100).toFixed(1);
    return `${profit}%`;
  };

  const getMainArtist = (artists: { name: string; role: string }[]) => {
    const mainArtist = artists.find(artist => artist.role === "main");
    return mainArtist ? mainArtist.name : "Unknown Artist";
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý sản phẩm" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                Quản lý Sản phẩm
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
                Quản lý toàn bộ sản phẩm đĩa than trong cửa hàng
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm theo tên, SKU, nghệ sĩ..."
                    className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

                <Select defaultValue="all-status">
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Đang bán</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-genres">
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-genres">Tất cả thể loại</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="progressive-rock">Progressive Rock</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              Hiển thị <span className="font-medium text-slate-900 dark:text-white">1-5</span> trong <span className="font-medium text-slate-900 dark:text-white">127</span> sản phẩm
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-48 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/20 to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {product.is_featured && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">{product.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{getMainArtist(product.artists)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">SKU: {product.sku}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Thể loại</p>
                        <p className="font-medium text-slate-900 dark:text-white">{product.genre}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{product.label}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Giá bán</p>
                        <p className="font-bold text-amber-600">{formatPrice(product.price)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Lợi nhuận: {calculateProfit(product.price, product.cost_price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Kho / Đã bán</p>
                        <p className="font-medium text-slate-900 dark:text-white">{product.stock_quantity} / {product.total_sold}</p>
                        {getStatusBadge(product.status)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-slate-200">Trước</Button>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">1</Button>
              <Button variant="outline" size="sm" className="border-slate-200">2</Button>
              <Button variant="outline" size="sm" className="border-slate-200">3</Button>
              <span className="px-2 text-slate-500 dark:text-slate-400">...</span>
              <Button variant="outline" size="sm" className="border-slate-200">26</Button>
              <Button variant="outline" size="sm" className="border-slate-200">Sau</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
