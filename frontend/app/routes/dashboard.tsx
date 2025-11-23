import { Link, useNavigate, useRevalidator } from "react-router";
import { api } from "~/lib/api";
import { useSession } from "~/lib/auth-client";
import { formatPrice, formatDate, getStatusBadgeColor } from "~/lib/utils";
import type { ProductsResponse, Listing } from "~/types";
import type { Route } from "./+types/dashboard";
import {
  Package,
  ShoppingBag,
  Heart,
  Clock,
  Star,
  TrendingUp,
  Award,
  Truck,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { AddProductDialog } from "~/components/AddProductDialog";

export function meta() {
  return [
    { title: "Dashboard - Gearsey" },
    { name: "description", content: "Manage your account" },
  ];
}

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sellerStats, setSellerStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalItemsSold: 0,
  });
  const [sellerRating, setSellerRating] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const userRole = user?.role || "buyer";
  const isBuyer = userRole === "buyer" || userRole === "customer";
  const isSeller = userRole === "seller";

  // Protect dashboard - authenticated users (buyers and sellers) can access
  useEffect(() => {
    if (!isPending && !session?.session) {
      // Not authenticated - redirect to login
      navigate("/login", { replace: true });
      return;
    }

    // Redirect admin users to admin panel
    if (!isPending && user?.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
  }, [session, isPending, user?.role, navigate]);

  // Fetch seller's products
  useEffect(() => {
    async function fetchSellerProducts() {
      if (isSeller && user?.id) {
        setIsLoading(true);
        try {
          const response = (await api.products.getAll({
            sellerId: user.id,
          })) as ProductsResponse;
          setMyListings(response.products || []);
        } catch (error) {
          console.error("Failed to fetch seller products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchSellerProducts();
  }, [isSeller, user?.id, revalidator.state]);

  // Fetch seller stats (revenue, orders, items sold)
  useEffect(() => {
    async function fetchSellerStats() {
      if (isSeller && user?.id) {
        try {
          const response = await api.orders.getSellerStats(user.id);
          setSellerStats(response.stats);
        } catch (error) {
          console.error("Failed to fetch seller stats:", error);
        }
      }
    }

    fetchSellerStats();
  }, [isSeller, user?.id, revalidator.state]);

  // Fetch seller rating
  useEffect(() => {
    async function fetchSellerRating() {
      if (isSeller && user?.id) {
        try {
          const response = await api.reviews.getSellerRating(user.id) as any;
          setSellerRating({
            averageRating: response.averageRating || 0,
            totalReviews: response.totalReviews || 0,
          });
        } catch (error) {
          console.error("Failed to fetch seller rating:", error);
        }
      }
    }

    fetchSellerRating();
  }, [isSeller, user?.id, revalidator.state]);

  // Calculate active and sold listings (must be before early return to follow React hooks rules)
  const activeListings = useMemo(() => {
    if (!isSeller) return [];
    return myListings.filter((l: Listing) => {
      if (l.is_auction && l.auction) {
        return l.auction.status === "Active";
      }
      return l.status === "Active";
    });
  }, [isSeller, myListings]);

  const soldListings = useMemo(() => {
    if (!isSeller) return [];
    return myListings.filter((l: Listing) => {
      if (l.is_auction && l.auction) {
        return l.auction.status === "Closed";
      }
      return l.status === "Sold";
    });
  }, [isSeller, myListings]);

  // If not authenticated or still loading, don't render the page
  if (isPending || !session) {
    return null;
  }

  // Mock buyer data - replace with actual API calls
  const buyerOrders = [
    {
      id: "ORD001",
      productName: "Honda Civic Brake Pads",
      seller: "Auto Parts Pro",
      price: 15000,
      status: "Delivered",
      date: "2024-11-10",
      image: "/placeholder.png",
    },
    {
      id: "ORD002",
      productName: "Toyota Corolla Headlights",
      seller: "Quality Parts",
      price: 28000,
      status: "In Transit",
      date: "2024-11-12",
      image: "/placeholder.png",
    },
  ];

  const buyerStats = {
    totalOrders: 12,
    pendingOrders: 3,
    completedOrders: 9,
    savedItems: 15,
  };

  // Render Buyer Dashboard
  if (isBuyer) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your purchases and manage your wishlist
            </p>
          </div>

          {/* Stats Overview for Buyer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {buyerStats.totalOrders}
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {buyerStats.pendingOrders}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {buyerStats.completedOrders}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Saved Items
                  </p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {buyerStats.savedItems}
                  </p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">
                  Recent Orders
                </h2>
                <Link
                  to="/orders"
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2"
                >
                  View All →
                </Link>
              </div>
            </div>

            {buyerOrders.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4">
                  {buyerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {order.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Seller: {order.seller}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Order ID: {order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-900 mb-1">
                          PKR {order.price.toLocaleString()}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg transition-colors text-center"
                        >
                          View Details
                        </Link>
                        {order.status === "Delivered" && (
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors">
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start shopping to see your orders here
                </p>
                <Link
                  to="/products"
                  className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions for Buyer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/products"
              className="group bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all"
            >
              <ShoppingBag className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-black mb-2">Continue Shopping</h3>
              <p className="text-red-100">Discover more amazing products</p>
            </Link>

            <Link
              to="/auctions"
              className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all"
            >
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-black mb-2">Live Auctions</h3>
              <p className="text-purple-100">Bid on exclusive items</p>
            </Link>

            <Link
              to="/cart"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all"
            >
              <ShoppingBag className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-black mb-2">View Cart</h3>
              <p className="text-blue-100">Complete your purchase</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Seller Dashboard
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {user?.name || user?.email?.split("@")[0] || "Seller"}'s
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your inventory and track your sales performance
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              New Listing
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Listings Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Total Listings
                </p>
                <p className="text-4xl font-black text-gray-900 mb-1">
                  {myListings.length}
                </p>
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  All products
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Listings Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Active Listings
                </p>
                <p className="text-4xl font-black text-gray-900 mb-1">
                  {activeListings.length}
                </p>
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available now
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Sold Items Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Sold Items
                </p>
                <p className="text-4xl font-black text-gray-900 mb-1">
                  {sellerStats.totalItemsSold}
                </p>
                <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Items from orders
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-md">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-semibold mb-1">
                  Total Revenue
                </p>
                <p className="text-4xl font-black text-white mb-1">
                  {formatPrice(sellerStats.totalRevenue)}
                </p>
                <p className="text-xs text-red-100 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {sellerStats.totalOrders} completed orders
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  Sales Performance
                  <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    +12.5%
                  </span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Track your sales trends and performance
                </p>
              </div>
              <select className="px-5 py-2.5 border-2 border-gray-300 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gradient-to-r from-white to-gray-50 hover:border-red-400 transition-all cursor-pointer shadow-sm">
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {[65, 45, 75, 55, 85, 70, 90].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg hover:from-red-600 hover:to-red-500 transition-all cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.floor(height * 100)} PKR
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Avg. Rating
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {sellerRating.averageRating > 0 
                        ? sellerRating.averageRating.toFixed(1)
                        : "N/A"}
                    </p>
                    {sellerRating.totalReviews > 0 && (
                      <p className="text-xs text-gray-500">
                        {sellerRating.totalReviews} review{sellerRating.totalReviews !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Orders
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {soldListings.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  My Listings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track all your products
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">
                Loading your products...
              </p>
            </div>
          ) : myListings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Listed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {myListings.map((listing: Listing) => (
                    <tr
                      key={listing._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-14 w-14 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm">
                            {listing.imageIds[0] && (
                              <img
                                src={api.products.getImage(
                                  listing.imageIds[0].fileName
                                )}
                                alt={listing.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {listing.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="font-semibold">
                                {listing.condition}
                              </span>
                              {listing.is_auction && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                  Auction
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-black text-gray-900">
                          {formatPrice(listing.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusBadgeColor(
                            listing.is_auction && listing.auction
                              ? listing.auction.status
                              : listing.status
                          )}`}
                        >
                          {listing.is_auction && listing.auction
                            ? listing.auction.status
                            : listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                        {formatDate(listing.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  No Listings Yet
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Start selling by creating your first product listing
                </p>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg"
                >
                  <Package className="w-5 h-5" />
                  Create First Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => {
          revalidator.revalidate();
        }}
      />
    </div>
  );
}
