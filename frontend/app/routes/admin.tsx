import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSession, signOut } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import { api } from "~/lib/api";
import type { Route } from "./+types/admin";
import {
  CheckCircle,
  Star,
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard - Gearsey" },
    { name: "description", content: "Manage your Gearsey marketplace" },
  ];
}

// Mock data - replace with API calls
const mockStats = {
  totalProducts: 1247,
  totalUsers: 5632,
  totalOrders: 892,
  totalRevenue: 4523000,
  activeAuctions: 45,
  pendingApprovals: 23,
};

const mockRecentOrders = [
  {
    id: "ORD001",
    customer: "Ahmed Khan",
    amount: 45000,
    status: "completed",
    date: "2024-11-10",
  },
  {
    id: "ORD002",
    customer: "Sara Ali",
    amount: 28000,
    status: "processing",
    date: "2024-11-10",
  },
  {
    id: "ORD003",
    customer: "Ali Raza",
    amount: 67000,
    status: "in-transit",
    date: "2024-11-09",
  },
];

const mockRecentProducts = [
  {
    id: "1",
    name: "Honda Civic Brake Pads",
    seller: "Auto Parts Pro",
    price: 15000,
    status: "approved",
    date: "2024-11-10",
    reviews: 12,
  },
  {
    id: "2",
    name: "Toyota Corolla Headlights",
    seller: "Quality Parts",
    price: 28000,
    status: "pending",
    date: "2024-11-10",
    reviews: 5,
  },
  {
    id: "3",
    name: "Suzuki Alto Engine Oil",
    seller: "Spare Parts Hub",
    price: 3500,
    status: "approved",
    date: "2024-11-09",
    reviews: 8,
  },
];

const mockReviews = [
  {
    id: 1,
    productId: "1",
    productName: "Honda Civic Brake Pads",
    userName: "Ahmed Khan",
    rating: 5,
    comment: "Excellent quality! Exactly as described.",
    date: "2024-01-15",
  },
  {
    id: 2,
    productId: "2",
    productName: "Toyota Corolla Headlights",
    userName: "Fatima Ali",
    rating: 4,
    comment: "Good product, delivery was fast.",
    date: "2024-01-10",
  },
  {
    id: 3,
    productId: "3",
    productName: "Suzuki Alto Engine Oil",
    userName: "Ali Raza",
    rating: 3,
    comment: "Average quality, could be better.",
    date: "2024-01-08",
  },
  {
    id: 4,
    productId: "1",
    productName: "Honda Civic Brake Pads",
    userName: "Sara Malik",
    rating: 5,
    comment: "Perfect fit and great performance!",
    date: "2024-01-05",
  },
];

// Analytics data for charts
const revenueData = [
  { month: "Jan", revenue: 320000, orders: 65 },
  { month: "Feb", revenue: 380000, orders: 78 },
  { month: "Mar", revenue: 420000, orders: 85 },
  { month: "Apr", revenue: 460000, orders: 92 },
  { month: "May", revenue: 510000, orders: 105 },
  { month: "Jun", revenue: 480000, orders: 98 },
];

const categoryData = [
  { name: "Engine Parts", value: 35, color: "#ef4444" },
  { name: "Body Parts", value: 25, color: "#f59e0b" },
  { name: "Electrical", value: 20, color: "#3b82f6" },
  { name: "Interior", value: 12, color: "#8b5cf6" },
  { name: "Others", value: 8, color: "#6b7280" },
];

const userGrowthData = [
  { month: "Jan", users: 4200 },
  { month: "Feb", users: 4500 },
  { month: "Mar", users: 4800 },
  { month: "Apr", users: 5100 },
  { month: "May", users: 5400 },
  { month: "Jun", users: 5632 },
];

const topProducts = [
  { name: "Brake Pads", sales: 245, revenue: 3675000 },
  { name: "Oil Filters", sales: 198, revenue: 693000 },
  { name: "Headlights", sales: 156, revenue: 4368000 },
  { name: "Air Filters", sales: 142, revenue: 710000 },
  { name: "Spark Plugs", sales: 128, revenue: 256000 },
];

type TabType = "overview" | "products" | "auctions" | "users" | "orders" | "reviews";

// Force recompile - fixing JSX structure
export default function Admin() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  
  const isOverview: boolean = activeTab === "overview";
  const isProducts: boolean = activeTab === "products";
  const isReviews: boolean = activeTab === "reviews";
  const isAuctions: boolean = activeTab === "auctions";
  const isUsers: boolean = activeTab === "users";
  const isOrders: boolean = activeTab === "orders";
  const [products, setProducts] = useState(mockRecentProducts);
  const [reviews, setReviews] = useState(mockReviews);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState(mockStats);
  const [revenueChartData, setRevenueData] = useState(revenueData);
  const [userChartData, setUserGrowthData] = useState(userGrowthData);
  const [categoryChartData, setCategoryData] = useState(categoryData);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders and products in parallel
        const [ordersData, productsData, reviewsData] = await Promise.all([
          api.orders.getAll().catch(() => ({ orders: [] })),
          api.products.getAll({ limit: 50 }).catch(() => ({ products: [] })),
          api.reviews.getAll().catch(() => ({ reviews: [] })),
        ]) as [any, any, any];

        // Update products
        if (productsData.products && Array.isArray(productsData.products)) {
          const formattedProducts = productsData.products
            .slice(0, 10)
            .map((p: any) => ({
              id: p._id,
              name: p.title,
              seller: p.sellerId,
              price: p.price,
              status: "approved",
              date: new Date(p.createdAt).toISOString().split("T")[0],
              reviews: 0,
            }));
          setProducts(formattedProducts);
        }

        // Update orders
        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          const formattedOrders = ordersData.orders
            .slice(0, 10)
            .map((o: any) => ({
              id: o._id,
              customer: o.userId,
              amount: o.total_amount,
              status: o.payment_status?.toLowerCase() || "pending",
              date: new Date(o.createdAt).toISOString().split("T")[0],
            }));
          setOrders(formattedOrders);

          // Calculate monthly revenue and order counts
          const monthlyStats: { [key: string]: { revenue: number; orders: number } } = {};
          ordersData.orders.forEach((order: any) => {
            const date = new Date(order.createdAt);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            
            if (!monthlyStats[monthKey]) {
              monthlyStats[monthKey] = { revenue: 0, orders: 0 };
            }
            monthlyStats[monthKey].revenue += order.total_amount || 0;
            monthlyStats[monthKey].orders += 1;
          });

          // Create revenue chart data
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          const newRevenueData = months.map(month => ({
            month,
            revenue: monthlyStats[month]?.revenue || 0,
            orders: monthlyStats[month]?.orders || 0,
          }));
          setRevenueData(newRevenueData);

          // Calculate user growth (based on unique customers per month)
          const userGrowthByMonth: { [key: string]: Set<string> } = {};
          ordersData.orders.forEach((order: any) => {
            const date = new Date(order.createdAt);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            
            if (!userGrowthByMonth[monthKey]) {
              userGrowthByMonth[monthKey] = new Set();
            }
            userGrowthByMonth[monthKey].add(order.userId);
          });

          let cumulativeUsers = 0;
          const newUserGrowthData = months.map(month => {
            cumulativeUsers += userGrowthByMonth[month]?.size || 0;
            return { month, users: cumulativeUsers };
          });
          setUserGrowthData(newUserGrowthData);
        }

        // Update reviews
        if (reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
          const formattedReviews = reviewsData.reviews
            .slice(0, 10)
            .map((r: any) => ({
              id: r._id,
              productId: r.partId,
              productName: r.productName || "Product",
              userName: r.userId,
              rating: r.rating,
              comment: r.comment,
              date: new Date(r.createdAt).toISOString().split("T")[0],
            }));
          setReviews(formattedReviews);
        }

        // Calculate category distribution from products
        if (productsData.products && Array.isArray(productsData.products)) {
          const categoryStats: { [key: string]: number } = {};
          productsData.products.forEach((p: any) => {
            const category = p.categoryId?.name || 'Other';
            categoryStats[category] = (categoryStats[category] || 0) + 1;
          });

          // Format category data
          const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#6b7280"];
          const newCategoryData = Object.entries(categoryStats)
            .map(([name, value], i) => ({
              name,
              value: value as number,
              color: colors[i % colors.length],
            }))
            .slice(0, 5);
          
          setCategoryData(newCategoryData);
        }

        // Calculate stats from real data
        setStats((prev) => ({
          ...prev,
          totalProducts: productsData.products?.length || 0,
          totalOrders: ordersData.orders?.length || 0,
          totalRevenue:
            ordersData.orders?.reduce(
              (sum: number, o: any) => sum + (o.total_amount || 0),
              0
            ) || 0,
        }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    cartManager.clearCart();
    await signOut();
    navigate("/");
  };

  const handleDeleteProduct = (productId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      setProducts(products.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
      alert("Review deleted successfully!");
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this page
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Header with Gearsey branding */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Gearsey
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>

                {settingsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        navigate("/admin-profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        // Navigate to settings page when created
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>

                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        // Navigate to security page when created
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </button>

                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        // Navigate to help page when created
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setSettingsOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.[0] || "A"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <nav className="p-4 space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: TrendingUp },
              { id: "products", label: "Products", icon: Package },
              { id: "reviews", label: "Reviews", icon: Star },
              { id: "auctions", label: "Auctions", icon: Clock },
              { id: "users", label: "Users", icon: Users },
              { id: "orders", label: "Orders", icon: ShoppingBag },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 mt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                  {stats.pendingApprovals}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                  {stats.activeAuctions}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header with Actions */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {isOverview
                    ? "Dashboard Overview"
                    : activeTab.charAt(0).toUpperCase() +
                      activeTab.slice(1) +
                      " Management"}
                </h2>
                <p className="text-gray-600">
                  {isOverview
                    ? "Welcome back! Here's what's happening today."
                    : `Manage and monitor all ${activeTab} in your marketplace`}
                </p>
              </div>
              {!isOverview && (
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md">
                    + Add New
                  </button>
                </div>
              )}
            </div>
          </div>

          {isOverview && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 12%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Products
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 8%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 15%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 23%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    PKR {(stats.totalRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-10 h-10 opacity-80" />
                    <span className="text-3xl font-bold">
                      {stats.activeAuctions}
                    </span>
                  </div>
                  <h3 className="text-red-100 text-sm font-medium mb-1">
                    Active Auctions
                  </h3>
                  <p className="text-red-50 text-xs">
                    Live bidding in progress
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <AlertCircle className="w-10 h-10 opacity-80" />
                    <span className="text-3xl font-bold">
                      {stats.pendingApprovals}
                    </span>
                  </div>
                  <h3 className="text-orange-100 text-sm font-medium mb-1">
                    Pending Approvals
                  </h3>
                  <p className="text-orange-50 text-xs">
                    Requires your attention
                  </p>
                </div>
              </div>

              {/* Analytics Graphs */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  Analytics Overview
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Revenue & Orders Line Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">
                      Revenue & Orders Trend
                    </h4>
                    <div className="relative h-64">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 600 240"
                        preserveAspectRatio="none"
                      >
                        {/* Grid lines */}
                        <line
                          x1="0"
                          y1="60"
                          x2="600"
                          y2="60"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />
                        <line
                          x1="0"
                          y1="120"
                          x2="600"
                          y2="120"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />
                        <line
                          x1="0"
                          y1="180"
                          x2="600"
                          y2="180"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />

                        {/* Revenue line */}
                        <polyline
                          points={revenueChartData
                            .map((data, i) => {
                              const x = (i / (revenueChartData.length - 1)) * 600;
                              const maxRevenue = Math.max(
                                ...revenueChartData.map((d) => d.revenue)
                              );
                              const y = 220 - (data.revenue / maxRevenue) * 200;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke="url(#revenueGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Orders line */}
                        <polyline
                          points={revenueChartData
                            .map((data, i) => {
                              const x = (i / (revenueChartData.length - 1)) * 600;
                              const maxOrders = Math.max(
                                ...revenueChartData.map((d) => d.orders)
                              );
                              const y = 220 - (data.orders / maxOrders) * 200;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="5,5"
                        />

                        {/* Data points for Revenue */}
                        {revenueChartData.map((data, i) => {
                          const x = (i / (revenueChartData.length - 1)) * 600;
                          const maxRevenue = Math.max(
                            ...revenueChartData.map((d) => d.revenue)
                          );
                          const y = 220 - (data.revenue / maxRevenue) * 200;
                          return (
                            <circle
                              key={`rev-${i}`}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        })}

                        {/* Data points for Orders */}
                        {revenueChartData.map((data, i) => {
                          const x = (i / (revenueChartData.length - 1)) * 600;
                          const maxOrders = Math.max(
                            ...revenueChartData.map((d) => d.orders)
                          );
                          const y = 220 - (data.orders / maxOrders) * 200;
                          return (
                            <circle
                              key={`ord-${i}`}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#3b82f6"
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        })}

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      {revenueChartData.map((data, index) => (
                        <div key={index} className="text-center">
                          <p className="text-xs font-medium text-gray-500">
                            {data.month}
                          </p>
                          <p className="text-xs font-bold text-gray-900 mt-1">
                            PKR {(data.revenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                        <span className="text-gray-600">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-0.5 bg-blue-500"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 5px, transparent 5px, transparent 10px)",
                          }}
                        ></div>
                        <span className="text-gray-600">Orders</span>
                      </div>
                    </div>
                  </div>

                  {/* User Growth Line Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">
                      User Growth
                    </h4>
                    <div className="relative h-64">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 600 240"
                        preserveAspectRatio="none"
                      >
                        {/* Grid lines */}
                        <line
                          x1="0"
                          y1="60"
                          x2="600"
                          y2="60"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />
                        <line
                          x1="0"
                          y1="120"
                          x2="600"
                          y2="120"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />
                        <line
                          x1="0"
                          y1="180"
                          x2="600"
                          y2="180"
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />

                        {/* Area fill */}
                        <polygon
                          points={`0,220 ${userChartData
                            .map((data, i) => {
                              const x = (i / (userChartData.length - 1)) * 600;
                              const maxUsers = Math.max(
                                ...userChartData.map((d) => d.users)
                              );
                              const y = 220 - (data.users / maxUsers) * 200;
                              return `${x},${y}`;
                            })
                            .join(" ")} 600,220`}
                          fill="url(#userGradient)"
                          opacity="0.3"
                        />

                        {/* Line */}
                        <polyline
                          points={userChartData
                            .map((data, i) => {
                              const x = (i / (userChartData.length - 1)) * 600;
                              const maxUsers = Math.max(
                                ...userChartData.map((d) => d.users)
                              );
                              const y = 220 - (data.users / maxUsers) * 200;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke="url(#userLineGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {userChartData.map((data, i) => {
                          const x = (i / (userChartData.length - 1)) * 600;
                          const maxUsers = Math.max(
                            ...userChartData.map((d) => d.users)
                          );
                          const y = 220 - (data.users / maxUsers) * 200;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="5"
                              fill="#8b5cf6"
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        })}

                        {/* Gradient definitions */}
                        <defs>
                          <linearGradient
                            id="userGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#c4b5fd" />
                          </linearGradient>
                          <linearGradient
                            id="userLineGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      {userChartData.map((data, index) => (
                        <div key={index} className="text-center">
                          <p className="text-xs font-medium text-gray-500">
                            {data.month}
                          </p>
                          <p className="text-xs font-bold text-gray-900 mt-1">
                            {data.users.toLocaleString()}
                          </p>
                          {index > 0 && (
                            <p className="text-xs text-green-600">
                              +
                              {(
                                ((data.users -
                                  userChartData[index - 1].users) /
                                  userChartData[index - 1].users) *
                                100
                              ).toFixed(0)}
                              %
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">
                      Sales by Category
                    </h4>
                    <div className="space-y-4">
                      {categoryChartData.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {category.name}
                            </span>
                            <span className="font-bold text-gray-900">
                              {category.value}%
                            </span>
                          </div>
                          <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="absolute h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${category.value}%`,
                                backgroundColor: category.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Total Categories
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {categoryChartData.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">
                      Top Selling Products
                    </h4>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {product.sales} sales
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                PKR {(product.revenue / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-600"
                                style={{
                                  width: `${(product.sales / topProducts[0].sales) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-red-600" />
                      Recent Orders
                    </h3>
                    <Link
                      to="/admin?tab=orders"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.customer}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.id} • {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              PKR {order.amount.toLocaleString()}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No orders found
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-red-600" />
                      Recent Products
                    </h3>
                    <Link
                      to="/admin?tab=products"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {products.length > 0 && products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">by {product.seller}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-gray-900">PKR {product.price.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{product.status}</span>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && <div className="text-center py-8 text-gray-500">No products found</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isProducts && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Product Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View and manage all products in the marketplace
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Reviews
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .filter(
                        (p) =>
                          (filterStatus === "all" ||
                            p.status === filterStatus) &&
                          (searchQuery === "" ||
                            p.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()))
                      )
                      .map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.seller}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                            PKR {product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                product.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {product.reviews}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium space-x-3">
                            <Link
                              to={`/products/${product.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {products.filter(
                (p) =>
                  (filterStatus === "all" || p.status === filterStatus) &&
                  (searchQuery === "" ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}

          {isReviews && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Review Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor and moderate customer reviews
                  </p>
                </div>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>All Ratings</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                    <option>2 Stars</option>
                    <option>1 Star</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {review.userName[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {review.userName}
                            </h4>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <Link
                      to={`/products/${review.productId}`}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold mb-3 bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <Package className="w-4 h-4" /> {review.productName}
                    </Link>

                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No reviews found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Reviews will appear here when customers leave feedback
                  </p>
                </div>
              )}
            </div>
          )}

          {isAuctions && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Auction Management
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Monitor live auctions, track bids, and manage auction listings
                  in real-time
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md font-semibold">
                  Coming Soon
                </button>
              </div>
            </div>
          )}

          {isUsers && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  User Management
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Manage user accounts, permissions, and monitor user activity
                  across the platform
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md font-semibold">
                  Coming Soon
                </button>
              </div>
            </div>
          )}

          {isOrders && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Track orders, manage fulfillment, and handle customer
                    transactions efficiently
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                            PKR {order.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium space-x-3">
                            <button className="text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No orders found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
