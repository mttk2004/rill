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
  Eye,
  Users,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react";
import { Head } from "@inertiajs/react";

const AdminCustomers = () => {

  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn Anh",
      email: "nguyen.van.anh@email.com",
      email_verified_at: "2023-05-15T10:30:00Z",
      role: "customer" as const,
      phone: "0901234567",
      gender: "male" as const,
      date_of_birth: "1990-03-15",
      avatar: "/placeholder-vinyl.jpg",
      is_active: true,
      created_at: "2023-05-15T09:00:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tran.thi.binh@email.com",
      email_verified_at: "2023-08-22T11:15:00Z",
      role: "customer" as const,
      phone: "0987654321",
      gender: "female" as const,
      date_of_birth: "1985-07-22",
      avatar: null,
      is_active: true,
      created_at: "2023-08-22T10:00:00Z",
      updated_at: "2024-01-18T16:45:00Z"
    },
    {
      id: 3,
      name: "Lê Hoàng Cường",
      email: "le.hoang.cuong@email.com",
      email_verified_at: "2022-12-10T14:20:00Z",
      role: "customer" as const,
      phone: "0912345678",
      gender: "male" as const,
      date_of_birth: "1988-12-10",
      avatar: "/placeholder-vinyl.jpg",
      is_active: true,
      created_at: "2022-12-10T08:30:00Z",
      updated_at: "2024-01-19T12:20:00Z"
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "pham.thi.dung@email.com",
      email_verified_at: null,
      role: "customer" as const,
      phone: "0898765432",
      gender: "female" as const,
      date_of_birth: "1995-01-08",
      avatar: null,
      is_active: true,
      created_at: "2024-01-01T12:00:00Z",
      updated_at: "2024-01-15T18:30:00Z"
    },
    {
      id: 5,
      name: "Võ Minh Hiếu",
      email: "vo.minh.hieu@email.com",
      email_verified_at: "2023-11-20T09:45:00Z",
      role: "customer" as const,
      phone: "0976543210",
      gender: "other" as const,
      date_of_birth: "1992-11-01",
      avatar: "/placeholder-vinyl.jpg",
      is_active: false,
      created_at: "2023-11-20T08:15:00Z",
      updated_at: "2023-12-15T10:00:00Z"
    }
  ];

  const getStatusBadge = (is_active: boolean) => {
    if (is_active) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoạt động
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <XCircle className="h-3 w-3 mr-1" />
          Không hoạt động
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa có đơn hàng";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý khách hàng" />
      <AdminNavigation />

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Quản lý Khách hàng
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
                Quản lý thông tin khách hàng và lịch sử mua hàng
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
                Thêm khách hàng
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Tổng khách hàng
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      2,547
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Hoạt động
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      1,892
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      VIP
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      156
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Mới tháng này
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      127
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
                    placeholder="Tìm theo tên, email, số điện thoại..."
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

                <Select defaultValue="all-verified">
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Xác thực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-verified">Tất cả</SelectItem>
                    <SelectItem value="verified">Đã xác thực</SelectItem>
                    <SelectItem value="unverified">Chưa xác thực</SelectItem>
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
              Hiển thị <span className="font-medium text-slate-900 dark:text-white">1-5</span> trong <span className="font-medium text-slate-900 dark:text-white">2,547</span> khách hàng
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-48 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới gia nhập</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
                <SelectItem value="orders-desc">Nhiều đơn hàng nhất</SelectItem>
                <SelectItem value="spent-desc">Chi tiêu cao nhất</SelectItem>
                <SelectItem value="recent-order">Mua hàng gần đây</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customers List */}
          <div className="space-y-4">
            {customers.map((customer, index) => (
              <Card
                key={customer.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Customer Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {customer.email_verified_at && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{customer.name}</h3>
                          {getStatusBadge(customer.is_active)}
                          {!customer.email_verified_at && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs border-0">
                              Chưa xác thực
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {getGenderIcon(customer.gender)} {calculateAge(customer.date_of_birth)} tuổi
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Vai trò</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">
                          Khách hàng
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Tham gia: {formatDate(customer.created_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Xác thực email</p>
                        <div className="flex items-center gap-1">
                          {customer.email_verified_at ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-lg text-green-600">Đã xác thực</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="font-bold text-lg text-red-600">Chưa xác thực</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {customer.email_verified_at 
                            ? `Xác thực: ${formatDate(customer.email_verified_at)}` 
                            : 'Chưa xác thực email'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Cập nhật cuối</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-amber-600" />
                          <span className="font-bold text-amber-600 text-lg">
                            {formatDate(customer.updated_at)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Trạng thái: {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Mail className="h-4 w-4" />
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
              <Button variant="outline" size="sm" className="border-slate-200">255</Button>
              <Button variant="outline" size="sm" className="border-slate-200">Sau</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
