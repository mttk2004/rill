import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Grid, List } from "lucide-react";
import { useState } from "react";
import vinylProduct from "@/assets/vinyl-product.jpg";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const products = [
    {
      id: 1,
      name: "Abbey Road - The Beatles",
      artist: "The Beatles",
      genre: "Rock",
      label: "Apple Records",
      price: "1.250.000",
      originalPrice: "1.500.000",
      rating: 4.9,
      reviews: 128,
      image: vinylProduct,
      badge: "Bán chạy",
      inStock: true
    },
    {
      id: 2,
      name: "Dark Side of the Moon",
      artist: "Pink Floyd",
      genre: "Progressive Rock",
      label: "Harvest Records",
      price: "980.000",
      rating: 4.8,
      reviews: 95,
      image: vinylProduct,
      badge: "Mới về",
      inStock: true
    },
    {
      id: 3,
      name: "Thriller - Michael Jackson",
      artist: "Michael Jackson",
      genre: "Pop",
      label: "Epic Records",
      price: "1.100.000",
      rating: 4.9,
      reviews: 203,
      image: vinylProduct,
      badge: "Giảm giá",
      inStock: false
    },
    {
      id: 4,
      name: "Hotel California - Eagles",
      artist: "Eagles",
      genre: "Rock",
      label: "Asylum Records",
      price: "1.350.000",
      rating: 4.7,
      reviews: 87,
      image: vinylProduct,
      inStock: true
    },
    {
      id: 5,
      name: "Rumours - Fleetwood Mac",
      artist: "Fleetwood Mac",
      genre: "Rock",
      label: "Warner Bros",
      price: "1.200.000",
      rating: 4.8,
      reviews: 156,
      image: vinylProduct,
      inStock: true
    },
    {
      id: 6,
      name: "The Wall - Pink Floyd",
      artist: "Pink Floyd",
      genre: "Progressive Rock",
      label: "Harvest Records",
      price: "1.450.000",
      rating: 4.9,
      reviews: 142,
      image: vinylProduct,
      inStock: true
    }
  ];

  const genres = ["Tất cả", "Rock", "Pop", "Jazz", "Classical", "Progressive Rock"];
  const labels = ["Tất cả", "Apple Records", "Harvest Records", "Epic Records", "Warner Bros", "Asylum Records"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Bộ sưu tập đĩa than</h1>
          <p className="text-white/90 text-lg">
            Khám phá hơn 1,000+ đĩa than chính hãng từ những nghệ sĩ huyền thoại
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search & Filters */}
          <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm album, nghệ sĩ..."
                className="pl-10"
              />
            </div>

            <Select defaultValue="all-genres">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre.toLowerCase().replace(/\s+/g, '-')}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="all-labels">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Hãng đĩa" />
              </SelectTrigger>
              <SelectContent>
                {labels.map((label) => (
                  <SelectItem key={label} value={label.toLowerCase().replace(/\s+/g, '-')}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode & Sort */}
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Select defaultValue="popular">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Hiển thị <span className="font-medium">1-6</span> trong <span className="font-medium">156</span> sản phẩm
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}>
          {products.map((product, index) => (
            <Card
              key={product.id}
              className={`product-hover cursor-pointer animate-fade-in border-0 shadow-vinyl ${
                viewMode === "list" ? "flex-row" : ""
              } ${!product.inStock ? "opacity-75" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
                <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full object-cover ${
                      viewMode === "list" ? "h-32" : "h-64"
                    } ${
                      viewMode === "list" ? "rounded-l-lg" : "rounded-t-lg"
                    }`}
                  />
                  {product.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-accent text-accent-foreground"
                    >
                      {product.badge}
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Badge variant="destructive">Hết hàng</Badge>
                    </div>
                  )}
                </div>

                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-muted-foreground mb-2">{product.artist}</p>

                      {viewMode === "list" && (
                        <div className="text-sm text-muted-foreground mb-3">
                          <p>Thể loại: {product.genre}</p>
                          <p>Hãng đĩa: {product.label}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews} đánh giá)</span>
                      </div>
                    </div>

                    <div className={`flex ${viewMode === "list" ? "flex-col items-end" : "items-center justify-between"}`}>
                      <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-3" : ""}`}>
                        <span className="text-xl font-bold text-accent">{product.price}đ</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice}đ
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={product.inStock ? "outline" : "secondary"}
                        disabled={!product.inStock}
                        className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                      >
                        {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
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

export default Products;
