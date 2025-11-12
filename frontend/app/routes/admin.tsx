import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSession } from "~/lib/auth-client";
import type { Route } from "./+types/admin";

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
  { id: "ORD001", customer: "Ahmed Khan", amount: 45000, status: "completed", date: "2024-11-10" },
  { id: "ORD002", customer: "Sara Ali", amount: 28000, status: "processing", date: "2024-11-10" },
  { id: "ORD003", customer: "Ali Raza", amount: 67000, status: "in-transit", date: "2024-11-09" },
];

const mockRecentProducts = [
  { id: "1", name: "Honda Civic Brake Pads", seller: "Auto Parts Pro", price: 15000, status: "approved", date: "2024-11-10", reviews: 12 },
  { id: "2", name: "Toyota Corolla Headlights", seller: "Quality Parts", price: 28000, status: "pending", date: "2024-11-10", reviews: 5 },
  { id: "3", name: "Suzuki Alto Engine Oil", seller: "Spare Parts Hub", price: 3500, status: "approved", date: "2024-11-09", reviews: 8 },
];

const mockReviews = [
  { id: 1, productId: "1", productName: "Honda Civic Brake Pads", userName: "Ahmed Khan", rating: 5, comment: "Excellent quality! Exactly as described.", date: "2024-01-15" },
  { id: 2, productId: "2", productName: "Toyota Corolla Headlights", userName: "Fatima Ali", rating: 4, comment: "Good product, delivery was fast.", date: "2024-01-10" },
  { id: 3, productId: "3", productName: "Suzuki Alto Engine Oil", userName: "Ali Raza", rating: 3, comment: "Average quality, could be better.", date: "2024-01-08" },
  { id: 4, productId: "1", productName: "Honda Civic Brake Pads", userName: "Sara Malik", rating: 5, comment: "Perfect fit and great performance!", date: "2024-01-05" },
];

export default function Admin() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "auctions" | "users" | "orders" | "reviews">("overview");
  const [products, setProducts] = useState(mockRecentProducts);
  const [reviews, setReviews] = useState(mockReviews);
  
  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setProducts(products.filter(p => p.id !== productId));
      alert("Product deleted successfully!");
    }
  };
  
  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(r => r.id !== reviewId));
      alert("Review deleted successfully!");
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage your Gearsey marketplace</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {["overview", "products", "reviews", "auctions", "users", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalProducts}</p>
                    <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalOrders}</p>
                    <p className="text-sm text-green-600 mt-2">↑ 15% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">PKR {mockStats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">↑ 23% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Auctions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.activeAuctions}</p>
                    <p className="text-sm text-gray-600 mt-2">Live bidding</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.pendingApprovals}</p>
                    <p className="text-sm text-orange-600 mt-2">Requires attention</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Link to="/admin?tab=orders" className="text-sm text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {mockRecentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.id} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">PKR {order.amount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "completed" ? "bg-green-100 text-green-800" :
                          order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                  <Link to="/admin?tab=products" className="text-sm text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {mockRecentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">by {product.seller}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">PKR {product.price.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.status === "approved" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Product Management</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage all products in the marketplace</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.seller}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">PKR {product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          product.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.reviews} reviews</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.date}</td>
                      <td className="px-6 py-4 text-sm font-medium space-x-3">
                        <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-lg font-medium">No products found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Review Management</h3>
                <p className="text-sm text-gray-600 mt-1">Monitor and moderate customer reviews</p>
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">✓ Verified</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-400 text-lg">
                          {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Delete Review
                    </button>
                  </div>
                  
                  <Link to={`/products/${review.productId}`} className="text-blue-600 hover:underline text-sm font-medium mb-2 block">
                    📦 {review.productName}
                  </Link>
                  
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-lg font-medium">No reviews found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "auctions" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Auctions</h3>
            <p className="text-gray-600">Auction management interface will be displayed here</p>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">User Management</h3>
            <p className="text-gray-600">User management interface will be displayed here</p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Management</h3>
            <p className="text-gray-600">Order management interface will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
}
