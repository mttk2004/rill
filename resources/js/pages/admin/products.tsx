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
      name: "Abbey Road - The Beatles",
      artist: "The Beatles",
      sku: "VNL-BEAT-001",
      genre: "Rock",
      label: "Apple Records",
      price: "1.250.000",
      cost: "800.000",
      stock: 25,
      sold: 45,
      status: "active",
      image: "/placeholder-vinyl.jpg",
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Dark Side of the Moon",
      artist: "Pink Floyd",
      sku: "VNL-PINK-001",
      genre: "Progressive Rock",
      label: "Harvest Records",
      price: "980.000",
      cost: "650.000",
      stock: 0,
      sold: 38,
      status: "out_of_stock",
      image: "/placeholder-vinyl.jpg",
      createdAt: "2024-01-08"
    },
    {
      id: 3,
      name: "Thriller - Michael Jackson",
      artist: "Michael Jackson",
      sku: "VNL-MJ-001",
      genre: "Pop",
      label: "Epic Records",
      price: "1.100.000",
      cost: "750.000",
      stock: 15,
      sold: 32,
      status: "active",
      image: "/placeholder-vinyl.jpg",
      createdAt: "2024-01-05"
    },
    {
      id: 4,
      name: "Hotel California - Eagles",
      artist: "Eagles",
      sku: "VNL-EAG-001",
      genre: "Rock",
      label: "Asylum Records",
      price: "1.350.000",
      cost: "900.000",
      stock: 8,
      sold: 28,
      status: "low_stock",
      image: "/placeholder-vinyl.jpg",
      createdAt: "2024-01-03"
    },
    {
      id: 5,
      name: "The Wall - Pink Floyd",
      artist: "Pink Floyd",
      sku: "VNL-PINK-002",
      genre: "Progressive Rock",
      label: "Harvest Records",
      price: "1.450.000",
      cost: "950.000",
      stock: 20,
      sold: 22,
      status: "draft",
      image: "/placeholder-vinyl.jpg",
      createdAt: "2024-01-01"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Đang bán", color: "bg-green-100 text-green-800" },
      draft: { variant: "secondary" as const, label: "Nháp", color: "bg-gray-100 text-gray-800" },
      out_of_stock: { variant: "destructive" as const, label: "Hết hàng", color: "bg-red-100 text-red-800" },
      low_stock: { variant: "secondary" as const, label: "Sắp hết", color: "bg-yellow-100 text-yellow-800" }
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

  const calculateProfit = (price: string, cost: string) => {
    const priceNum = parseFloat(price.replace(/\./g, ''));
    const costNum = parseFloat(cost.replace(/\./g, ''));
    const profit = ((priceNum - costNum) / costNum * 100).toFixed(1);
    return `${profit}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý sản phẩm - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Quản lý Sản phẩm
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý toàn bộ sản phẩm đĩa than trong cửa hàng
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
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-vinyl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, SKU, nghệ sĩ..."
                  className="pl-10"
                />
              </div>

              <Select defaultValue="all-status">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  <SelectItem value="low_stock">Sắp hết</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-genres">
                <SelectTrigger className="w-48">
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
            Hiển thị <span className="font-medium">1-5</span> trong <span className="font-medium">127</span> sản phẩm
          </p>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
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
              className="shadow-vinyl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm">{product.artist}</p>
                      <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Thể loại</p>
                      <p className="font-medium">{product.genre}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.label}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Giá bán</p>
                      <p className="font-bold text-accent">{product.price}đ</p>
                      <p className="text-xs text-muted-foreground">
                        Lợi nhuận: {calculateProfit(product.price, product.cost)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Kho / Đã bán</p>
                      <p className="font-medium">{product.stock} / {product.sold}</p>
                      {getStatusBadge(product.status)}
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

export default AdminProducts;
