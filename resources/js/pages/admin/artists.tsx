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
  Calendar,
  Users,
  Disc,
  TrendingUp
} from "lucide-react";
import { Head } from "@inertiajs/react";

// Helper functions
const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
        Hoạt động
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200">
      Không hoạt động
    </Badge>
  );
};

const getProductCount = (artistId: number) => {
  // In real app, this would come from the backend
  const productCounts = {
    1: 12,
    2: 8,
    3: 15,
    4: 6,
    5: 23
  };
  return productCounts[artistId as keyof typeof productCounts] || 0;
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString));
};

const AdminArtists = () => {

  const artists = [
    {
      id: 1,
      name: "The Beatles",
      slug: "the-beatles",
      description: "Ban nhạc rock huyền thoại từ Liverpool, được thành lập năm 1960. Gồm John Lennon, Paul McCartney, George Harrison và Ringo Starr, họ được coi là ban nhạc có ảnh hưởng nhất trong lịch sử âm nhạc đại chúng.",
      image: "/placeholder-vinyl.jpg",
      country: "United Kingdom",
      is_active: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      name: "Pink Floyd",
      slug: "pink-floyd",
      description: "Ban nhạc progressive rock nổi tiếng với những album concept đình đám như The Dark Side of the Moon và The Wall. Được thành lập tại London năm 1965, nổi tiếng với âm thanh thực nghiệm và các buổi biểu diễn hoành tráng.",
      image: "/placeholder-vinyl.jpg",
      country: "United Kingdom", 
      is_active: true,
      created_at: "2024-01-12T09:15:00Z",
      updated_at: "2024-01-18T16:45:00Z"
    },
    {
      id: 3,
      name: "Michael Jackson",
      slug: "michael-jackson",
      description: "Ông hoàng nhạc pop, một trong những nghệ sĩ bán chạy nhất mọi thời đại. Với những album kinh điển như Thriller, Bad và Dangerous, ông đã thay đổi bộ mặt của ngành công nghiệp âm nhạc và giải trí.",
      image: "/placeholder-vinyl.jpg",
      country: "United States",
      is_active: true,
      created_at: "2024-01-10T08:20:00Z",
      updated_at: "2024-01-16T12:10:00Z"
    },
    {
      id: 4,
      name: "Eagles",
      slug: "eagles",
      description: "Ban nhạc rock Mỹ được thành lập năm 1971, nổi tiếng với album Hotel California. Phong cách âm nhạc kết hợp giữa rock, country và folk đã tạo nên âm thanh đặc trưng và thu hút hàng triệu người hâm mộ trên toàn thế giới.",
      image: "/placeholder-vinyl.jpg",
      country: "United States",
      is_active: true,
      created_at: "2024-01-08T14:45:00Z",
      updated_at: "2024-01-14T09:30:00Z"
    },
    {
      id: 5,
      name: "Led Zeppelin", 
      slug: "led-zeppelin",
      description: "Ban nhạc hard rock huyền thoại, được coi là một trong những ban nhạc có ảnh hưởng nhất đến sự phát triển của heavy metal và hard rock. Với những bài hát kinh điển như Stairway to Heaven và Kashmir.",
      image: "/placeholder-vinyl.jpg",
      country: "United Kingdom",
      is_active: false,
      created_at: "2024-01-05T16:00:00Z",
      updated_at: "2024-01-10T11:20:00Z"
    }
  ];

  const getStatusBadge = (is_active: boolean) => {
    if (is_active) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          Hoạt động
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0">
          Không hoạt động
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getProductCount = (artistId: number) => {
    // In real app, this would come from backend API
    const productCounts = { 1: 12, 2: 8, 3: 6, 4: 5, 5: 9 };
    return productCounts[artistId as keyof typeof productCounts] || 0;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý nghệ sĩ" />
      <AdminNavigation />

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Music className="h-6 w-6 text-white" />
                </div>
                Quản lý Nghệ sĩ
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
                Quản lý thông tin nghệ sĩ và ban nhạc trong cửa hàng
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
                Thêm nghệ sĩ
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Tổng nghệ sĩ
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      127
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Hoạt động
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      95
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Quốc gia
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      24
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Mới thêm tháng này
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      8
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm theo tên nghệ sĩ, slug..."
                    className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

                <Select defaultValue="all-status">
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-countries">
                  <SelectTrigger className="w-48 border-slate-200">
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
              Hiển thị <span className="font-medium text-slate-900 dark:text-white">1-5</span> trong <span className="font-medium text-slate-900 dark:text-white">127</span> nghệ sĩ
            </p>
            <Select defaultValue="name-asc">
              <SelectTrigger className="w-48 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="country-asc">Quốc gia A-Z</SelectItem>
                <SelectItem value="active-first">Hoạt động trước</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Artists List */}
          <div className="space-y-4">
            {artists.map((artist, index) => (
              <Card
                key={artist.id}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/20 to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Artist Image */}
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 relative">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {artist.is_active && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{artist.name}</h3>
                          {getStatusBadge(artist.is_active)}
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm mb-2">
                          <Globe className="h-3 w-3" />
                          {artist.country}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {artist.description}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sản phẩm</p>
                        <p className="font-bold text-2xl text-slate-900 dark:text-white">{getProductCount(artist.id)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">albums</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Ngày tạo</p>
                        <p className="font-bold text-blue-600 text-lg">{formatDate(artist.created_at)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">thêm vào</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Cập nhật cuối</p>
                        <p className="font-bold text-amber-600 text-lg">{formatDate(artist.updated_at)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">lần cuối</p>
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

export default AdminArtists;
