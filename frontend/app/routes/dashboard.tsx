import { Link, useNavigate, useRevalidator } from "react-router";
import { api } from "~/lib/api";
import { useSession } from "~/lib/auth-client";
import { formatPrice, formatDate, getStatusBadgeColor } from "~/lib/utils";
import type { ProductsResponse } from "~/types";
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
import { useEffect, useState } from "react";
import { AddProductDialog } from "~/components/AddProductDialog";

export function meta() {
  return [
    { title: "Dashboard - Gearsey" },
    { name: "description", content: "Manage your account" },
  ];
}

type LoaderData = {
  myListings: any[];
  sellerId: string;
};

export default function Dashboard() {
  // Use mock data - will be replaced by useSession in component
  const myListings: any[] = [];
  const sellerId = "mock-seller-id";
  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
  }, [user?.role, navigate]);

  const activeListings = myListings.filter((l: any) => l.status === "Active");
  const soldListings = myListings.filter((l: any) => l.status === "Sold");

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
                  {soldListings.length}
                </p>
                <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Completed sales
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
                  {formatPrice(0)}
                </p>
                <p className="text-xs text-red-100 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Last 30 days
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
                <option value="7">📅 Last 7 days</option>
                <option value="14">📅 Last 14 days</option>
                <option value="30">📅 Last 30 days</option>
                <option value="60">📅 Last 60 days</option>
                <option value="90">📅 Last 90 days</option>
                <option value="180">📅 Last 6 months</option>
                <option value="365">📅 Last year</option>
                <option value="custom">🗓️ Custom range</option>
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
                    <p className="text-xl font-black text-gray-900">4.8</p>
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

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Favorites
                    </p>
                    <p className="text-xl font-black text-gray-900">156</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Success Rate
                    </p>
                    <p className="text-xl font-black text-gray-900">94%</p>
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

          {myListings.length > 0 ? (
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
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {myListings.map((listing: any) => (
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
                            listing.status
                          )}`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                        {formatDate(listing.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            to={`/products/${listing._id}`}
                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                            title="View Product"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </Link>
                          <button
                            className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                            title="Edit Product"
                            onClick={() =>
                              alert("Edit functionality coming soon!")
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                            title="View Reviews"
                            onClick={() =>
                              alert("Reviews functionality coming soon!")
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                            Reviews
                          </button>
                          <button
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                            title="Delete Product"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete "${listing.name}"? This action cannot be undone.`
                                )
                              ) {
                                alert(
                                  "Delete functionality will be implemented with backend API"
                                );
                              }
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
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
