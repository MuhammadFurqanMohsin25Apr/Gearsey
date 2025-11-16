import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth-client";

// Mock data for fallback
const mockStats = {
  totalProducts: 1247,
  totalUsers: 5632,
  totalBuyers: 1200,
  totalSellers: 850,
  totalOrders: 892,
  totalRevenue: 4523000,
  activeAuctions: 45,
  pendingApprovals: 23,
};

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

// Analytics data for charts
const mockRevenueData = [
  { month: "Jan", revenue: 320000, orders: 65 },
  { month: "Feb", revenue: 380000, orders: 78 },
  { month: "Mar", revenue: 420000, orders: 85 },
  { month: "Apr", revenue: 460000, orders: 92 },
  { month: "May", revenue: 510000, orders: 105 },
  { month: "Jun", revenue: 480000, orders: 98 },
];

const mockCategoryData = [
  { name: "Engine Parts", value: 35, color: "#ef4444" },
  { name: "Body Parts", value: 25, color: "#f59e0b" },
  { name: "Electrical", value: 20, color: "#3b82f6" },
  { name: "Interior", value: 12, color: "#8b5cf6" },
  { name: "Others", value: 8, color: "#6b7280" },
];

const mockUserGrowthData = [
  { month: "Jan", users: 4200 },
  { month: "Feb", users: 4500 },
  { month: "Mar", users: 4800 },
  { month: "Apr", users: 5100 },
  { month: "May", users: 5400 },
  { month: "Jun", users: 5632 },
];

const mockTopProducts = [
  { name: "Brake Pads", sales: 245, revenue: 3675000 },
  { name: "Oil Filters", sales: 198, revenue: 693000 },
  { name: "Headlights", sales: 156, revenue: 4368000 },
  { name: "Air Filters", sales: 142, revenue: 710000 },
  { name: "Spark Plugs", sales: 128, revenue: 256000 },
];

export const loader = async () => {};

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [products, setProducts] = useState(mockRecentProducts);
  const [orders, setOrders] = useState(mockRecentOrders);
  const [revenueChartData, setRevenueData] = useState(mockRevenueData);
  const [userChartData, setUserGrowthData] = useState(mockUserGrowthData);
  const [categoryChartData, setCategoryData] = useState(mockCategoryData);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders, products, reviews in parallel
        const [
          ordersData,
          productsData,
          auctionsData,
          buyersData,
          sellersData,
        ] = (await Promise.all([
          api.orders.getAll().catch((err) => {
            console.error("Orders API error:", err);
            return { orders: [] };
          }),
          api.products.getAll({ limit: 5000 }).catch((err) => {
            console.error("Products API error:", err);
            return { products: [] };
          }),
          api.auctions.getAll({ limit: 1000 }).catch((err) => {
            console.error("Auctions API error:", err);
            return { auctions: [] };
          }),
          authClient.admin
            .listUsers({
              query: {
                filterField: "role",
                filterValue: "buyer",
                filterOperator: "eq",
              },
            })
            .catch((err) => {
              console.error("Buyers list error:", err);
              return { data: { users: [] } };
            }),
          authClient.admin
            .listUsers({
              query: {
                filterField: "role",
                filterValue: "seller",
                filterOperator: "eq",
              },
            })
            .catch((err) => {
              console.error("Sellers list error:", err);
              return { data: { users: [] } };
            }),
        ])) as [any, any, any, any, any];

        console.log("API Responses:", {
          ordersData,
          productsData,
          auctionsData,
          buyersData,
          sellersData,
        });

        // Process products
        if (productsData.products && Array.isArray(productsData.products)) {
          const formattedProducts = productsData.products
            .slice(0, 3)
            .map((p: any) => ({
              id: p._id,
              name: p.title,
              seller: p.sellerId,
              price: p.price,
              status: "approved",
              date: p.createdAt
                ? new Date(p.createdAt).toISOString().split("T")[0]
                : "N/A",
              reviews: 0,
            }));
          setProducts(formattedProducts);
        }

        // Process orders
        if (
          ordersData.orders &&
          Array.isArray(ordersData.orders) &&
          ordersData.orders.length > 0
        ) {
          const formattedOrders = ordersData.orders
            .slice(0, 3)
            .map((o: any) => ({
              id: o._id,
              customer: o.userId,
              amount: o.total_amount,
              status: o.payment_status?.toLowerCase() || "pending",
              date: o.createdAt
                ? new Date(o.createdAt).toISOString().split("T")[0]
                : "N/A",
            }));
          setOrders(formattedOrders);
        }

        // Calculate monthly revenue and order counts from all orders
        const monthlyStats: {
          [key: string]: { revenue: number; orders: number };
        } = {};
        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          ordersData.orders.forEach((order: any) => {
            if (!order.createdAt) return;
            const date = new Date(order.createdAt);
            if (isNaN(date.getTime())) return;
            const monthKey = date.toLocaleDateString("en-US", {
              month: "short",
            });

            if (!monthlyStats[monthKey]) {
              monthlyStats[monthKey] = { revenue: 0, orders: 0 };
            }
            monthlyStats[monthKey].revenue += order.total_amount || 0;
            monthlyStats[monthKey].orders += 1;
          });
        }

        // Create revenue chart data - always show this
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const newRevenueData = months.map((month) => ({
          month,
          revenue: monthlyStats[month]?.revenue || 0,
          orders: monthlyStats[month]?.orders || 0,
        }));

        console.log("Monthly Stats:", monthlyStats);
        console.log("Revenue Chart Data:", newRevenueData);

        // Always update with calculated data from database
        setRevenueData(newRevenueData);

        // Calculate user growth - count unique users who created accounts in each month
        const userGrowthByMonth: { [key: string]: Set<string> } = {};

        // Use buyer and seller data to calculate user growth
        const allUsers = [
          ...(buyersData?.data?.users || []),
          ...(sellersData?.data?.users || []),
        ];

        if (allUsers.length > 0) {
          allUsers.forEach((user: any) => {
            if (!user.createdAt) return;
            const date = new Date(user.createdAt);
            if (isNaN(date.getTime())) return;
            const monthKey = date.toLocaleDateString("en-US", {
              month: "short",
            });

            if (!userGrowthByMonth[monthKey]) {
              userGrowthByMonth[monthKey] = new Set();
            }
            userGrowthByMonth[monthKey].add(user.id);
          });
        }

        let cumulativeUsers = 0;
        const months2 = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const newUserGrowthData = months2.map((month) => {
          cumulativeUsers += userGrowthByMonth[month]?.size || 0;
          return { month, users: cumulativeUsers };
        });

        console.log("User Growth By Month:", userGrowthByMonth);
        console.log("User Growth Chart Data:", newUserGrowthData);

        // Always update with calculated data from database
        setUserGrowthData(newUserGrowthData);

        // Calculate category distribution from products
        if (productsData.products && Array.isArray(productsData.products)) {
          const categoryStats: { [key: string]: number } = {};
          productsData.products.forEach((p: any) => {
            const category = p.categoryId?.name || "Other";
            categoryStats[category] = (categoryStats[category] || 0) + 1;
          });

          const colors = [
            "#ef4444",
            "#f59e0b",
            "#3b82f6",
            "#8b5cf6",
            "#6b7280",
          ];
          const newCategoryData = Object.entries(categoryStats)
            .map(([name, value], i) => ({
              name,
              value: value as number,
              color: colors[i % colors.length],
            }))
            .slice(0, 5);

          setCategoryData(newCategoryData);
        }

        // Count active auctions
        const activeAuctionsCount = Array.isArray(auctionsData?.auctions)
          ? auctionsData.auctions.filter((a: any) => a.status === "Active")
              .length
          : 0;

        const buyerCount = buyersData?.data?.users?.length || 0;
        const sellerCount = sellersData?.data?.users?.length || 0;
        const totalProductsCount = productsData.products?.length || 0;
        const totalOrdersCount = ordersData.orders?.length || 0;
        const totalRevenueAmount =
          ordersData.orders?.reduce(
            (sum: number, o: any) => sum + (o.total_amount || 0),
            0
          ) || 0;

        console.log("Dashboard Stats Fetched:", {
          totalProductsCount,
          totalOrdersCount,
          buyerCount,
          sellerCount,
          activeAuctionsCount,
          totalRevenueAmount,
        });

        // Update stats with fallback to mock data
        setStats({
          totalProducts: totalProductsCount,
          totalOrders: totalOrdersCount,
          totalUsers: buyerCount + sellerCount,
          totalBuyers: buyerCount,
          totalSellers: sellerCount,
          activeAuctions: activeAuctionsCount,
          totalRevenue: totalRevenueAmount,
          pendingApprovals: mockStats.pendingApprovals,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use mock data as fallback
        setRevenueData(mockRevenueData);
        setUserGrowthData(mockUserGrowthData);
        setCategoryData(mockCategoryData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 p-4 lg:p-4">
      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <div className="bg-white rounded-lg shadow-sm p-2.5 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-7 h-7 bg-blue-50 rounded flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-2 h-2" /> 12%
            </span>
          </div>
          <h3 className="text-gray-600 text-xs font-medium mb-0.5">
            Total Products
          </h3>
          <p className="text-base font-bold text-gray-900">
            {stats.totalProducts.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-cyan-50 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <TrendingUp className="w-2 h-2" /> 5%
            </span>
          </div>
          <h3 className="text-gray-600 text-xs font-medium mb-1">
            Total Buyers
          </h3>
          <p className="text-base font-bold text-gray-900">
            {stats.totalBuyers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <TrendingUp className="w-2 h-2" /> 7%
            </span>
          </div>
          <h3 className="text-gray-600 text-xs font-medium mb-1">
            Total Sellers
          </h3>
          <p className="text-base font-bold text-gray-900">
            {stats.totalSellers.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <TrendingUp className="w-2 h-2" /> 15%
            </span>
          </div>
          <h3 className="text-gray-600 text-xs font-medium mb-1">
            Total Orders
          </h3>
          <p className="text-base font-bold text-gray-900">
            {stats.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <TrendingUp className="w-2 h-2" /> 23%
            </span>
          </div>
          <h3 className="text-gray-600 text-xs font-medium mb-1">
            Total Revenue
          </h3>
          <p className="text-base font-bold text-gray-900">
            PKR {(stats.totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-linear-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.activeAuctions}</span>
          </div>
          <h3 className="text-red-100 text-xs font-medium mb-1">
            Active Auctions
          </h3>
          <p className="text-red-50 text-xs">Live bidding in progress</p>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.pendingApprovals}</span>
          </div>
          <h3 className="text-orange-100 text-xs font-medium mb-1">
            Pending Approvals
          </h3>
          <p className="text-orange-50 text-xs">Requires your attention</p>
        </div>
      </div>

      {/* Analytics Graphs */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-red-600" />
          Analytics Overview
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Revenue & Orders Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h4 className="text-base font-bold text-gray-900 mb-6">
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
                <div className="w-8 h-0.5 bg-linear-to-r from-red-500 to-red-600"></div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h4 className="text-base font-bold text-gray-900 mb-6">
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
                        ((data.users - userChartData[index - 1].users) /
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h4 className="text-base font-bold text-gray-900 mb-6">
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
                <span className="text-sm text-gray-600">Total Categories</span>
                <span className="text-base font-bold text-gray-900">
                  {categoryChartData.length}
                </span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h4 className="text-base font-bold text-gray-900 mb-6">
              Top Selling Products
            </h4>
            <div className="space-y-4">
              {mockTopProducts.map((product: any, index: any) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="shrink-0 w-8 h-8 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg flex items-center justify-center font-bold text-sm">
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
                  <div className="shrink-0">
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-red-500 to-red-600"
                        style={{
                          width: `${(product.sales / mockTopProducts[0].sales) * 100}%`,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
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
            {products.length > 0 &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">by {product.seller}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${product.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
