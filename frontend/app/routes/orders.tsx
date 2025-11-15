import { Link } from "react-router";
import { useSession } from "~/lib/auth-client";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import type { Route } from "./+types/orders";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Orders - Gearsey" },
    {
      name: "description",
      content: "View your order history and track deliveries",
    },
  ];
}

export default function Orders() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await api.orders.getByUser(user.id);
        const data = response as any;
        if (data?.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-linear-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id?.substring(0, 8).toUpperCase() || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.delivery_status)}`}
                      >
                        {order.delivery_status?.replace("-", " ") || "Pending"}
                      </span>
                      <p className="text-lg font-bold text-gray-900">
                        PKR {order.total_amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Payment Status: <span className="font-semibold">{order.payment_status || "Pending"}</span>
                  </p>
                  
                  {/* Placeholder for items - backend will return items separately */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          Order Items
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.total_amount ? `Total: PKR ${order.total_amount.toLocaleString()}` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        alert("Order details feature coming soon!")
                      }
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    {order.delivery_status === "Delivered" && (
                      <button
                        onClick={() => alert("Review feature coming soon!")}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Leave Review
                      </button>
                    )}
                    {order.delivery_status === "Dispatched" && (
                      <button
                        onClick={() => alert("Tracking feature coming soon!")}
                        className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Track Order
                      </button>
                    )}
                    <button
                      onClick={() =>
                        alert("Invoice download feature coming soon!")
                      }
                      className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              className="w-20 h-20 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  function getStatusColor(status: string) {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Dispatched":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
