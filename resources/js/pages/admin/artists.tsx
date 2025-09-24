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
  Music,
  Filter,
  Download,
  Upload,
  Globe,
  Calendar
} from "lucide-react";
import { Head } from "@inertiajs/react";

const AdminArtists = () => {

  const artists = [
    {
      id: 1,
      name: "The Beatles",
      slug: "the-beatles",
      country: "United Kingdom",
      description: "Ban nhạc rock huyền thoại từ Liverpool, được thành lập năm 1960...",
      image: "/placeholder-vinyl.jpg",
      totalProducts: 12,
      totalSales: 456,
      revenue: "142.500.000",
      status: "active",
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-20"
    },
    {
      id: 2,
      name: "Pink Floyd",
      slug: "pink-floyd",
      country: "United Kingdom",
      description: "Ban nhạc progressive rock nổi tiếng với những album concept đình đám...",
      image: "/placeholder-vinyl.jpg",
      totalProducts: 8,
      totalSales: 234,
      revenue: "89.200.000",
      status: "active",
      createdAt: "2024-01-12",
      lastUpdated: "2024-01-18"
    },
    {
      id: 3,
      name: "Michael Jackson",
      slug: "michael-jackson",
      country: "United States",
      description: "Ông hoàng nhạc pop, một trong những nghệ sĩ bán chạy nhất mọi thời đại...",
      image: "/placeholder-vinyl.jpg",
      totalProducts: 6,
      totalSales: 187,
      revenue: "67.800.000",
      status: "active",
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-16"
    },
    {
      id: 4,
      name: "Eagles",
      slug: "eagles",
      country: "United States",
      description: "Ban nhạc rock Mỹ được thành lập năm 1971, nổi tiếng với album Hotel California...",
      image: "/placeholder-vinyl.jpg",
      totalProducts: 5,
      totalSales: 145,
      revenue: "52.300.000",
      status: "active",
      createdAt: "2024-01-08",
      lastUpdated: "2024-01-14"
    },
    {
      id: 5,
      name: "Led Zeppelin",
      slug: "led-zeppelin",
      country: "United Kingdom",
      description: "Ban nhạc hard rock huyền thoại, được coi là một trong những ban nhạc có ảnh hưởng nhất...",
      image: "/placeholder-vinyl.jpg",
      totalProducts: 9,
      totalSales: 98,
      revenue: "34.600.000",
      status: "draft",
      createdAt: "2024-01-05",
      lastUpdated: "2024-01-10"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
      draft: { variant: "secondary" as const, label: "Nháp", color: "bg-gray-100 text-gray-800" },
      inactive: { variant: "destructive" as const, label: "Không hoạt động", color: "bg-red-100 text-red-800" }
    };

    const config = variants[status as keyof typeof variants] || variants.draft;
    return (
      <Badge
        variant={config.variant}
        className={config.color}
      >
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return `${amount}đ`;
  };

  const countries = [
    "Tất cả quốc gia",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "France",
    "Germany",
    "Japan",
    "Vietnam"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý nghệ sĩ - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Music className="h-8 w-8" />
              Quản lý Nghệ sĩ
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin nghệ sĩ và ban nhạc trong cửa hàng
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Thêm nghệ sĩ
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng nghệ sĩ</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <Music className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">95</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quốc gia</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Globe className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mới thêm tháng này</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-vinyl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên nghệ sĩ, slug..."
                  className="pl-10"
                />
              </div>

              <Select defaultValue="all-status">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-countries">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country}
                      value={country.toLowerCase().replace(/\s+/g, '-')}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Hiển thị <span className="font-medium">1-5</span> trong <span className="font-medium">127</span> nghệ sĩ
          </p>
          <Select defaultValue="name-asc">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Tên A-Z</SelectItem>
              <SelectItem value="name-desc">Tên Z-A</SelectItem>
              <SelectItem value="products-desc">Nhiều sản phẩm nhất</SelectItem>
              <SelectItem value="sales-desc">Bán chạy nhất</SelectItem>
              <SelectItem value="revenue-desc">Doanh thu cao nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Artists List */}
        <div className="space-y-4">
          {artists.map((artist, index) => (
            <Card
              key={artist.id}
              className="shadow-vinyl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Artist Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Artist Info */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{artist.name}</h3>
                        {getStatusBadge(artist.status)}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                        <Globe className="h-3 w-3" />
                        {artist.country}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {artist.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Sản phẩm</p>
                      <p className="font-bold text-2xl">{artist.totalProducts}</p>
                      <p className="text-xs text-muted-foreground">albums</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Đã bán</p>
                      <p className="font-bold text-2xl text-blue-600">{artist.totalSales}</p>
                      <p className="text-xs text-muted-foreground">bản</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Doanh thu</p>
                      <p className="font-bold text-accent">{formatCurrency(artist.revenue)}</p>
                      <p className="text-xs text-muted-foreground">tổng cộng</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="outline" size="sm">26</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArtists;
