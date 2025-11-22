import { Link } from "react-router";
import { useSession } from "~/lib/auth-client";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import type { Route } from "./+types/orders";
import { ReviewDialog } from "~/components/ReviewDialog";

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
  const [wonAuctions, setWonAuctions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "auctions">("orders");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [orderProducts, setOrderProducts] = useState<Record<string, any>>({});

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
          console.log("Orders fetched:", data.orders);
          // Filter out auction orders from regular orders
          const regularOrders = data.orders.filter(
            (order: any) => !order.isAuction
          );
          setOrders(regularOrders);

          // Fetch product details for auction orders
          const productsMap: Record<string, any> = {};
          for (const order of data.orders) {
            if (order.isAuction && order.auctionId) {
              try {
                // Get auction details which includes the product
                const auctionsData = (await api.auctions.getAll({
                  limit: 100,
                })) as any;
                const auction = auctionsData.auctions?.find(
                  (a: any) => a._id === order.auctionId
                );
                if (auction) {
                  productsMap[order._id] = {
                    name: auction.partId?.name || "Auction Item",
                    image: auction.partId?.imageIds?.[0]?.fileName,
                    price: order.total_amount,
                    auction: auction,
                  };
                }
              } catch (err) {
                console.error("Failed to fetch auction details:", err);
              }
            }
          }
          setOrderProducts(productsMap);
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

  useEffect(() => {
    const fetchWonAuctions = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        const response = await api.auctions.getWonByUser(user.id);
        const data = response as any;
        if (data?.auctions) {
          console.log("Won auctions fetched:", data.auctions);
          setWonAuctions(data.auctions);
        } else {
          setWonAuctions([]);
        }
      } catch (err) {
        console.error("Failed to fetch won auctions:", err);
        setWonAuctions([]);
      }
    };

    fetchWonAuctions();
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

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "orders"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("auctions")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "auctions"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Auctions ({wonAuctions.length})
            </button>
          </div>
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
              <div
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        ) : activeTab === "orders" && orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        Order #
                        {order._id?.substring(0, 8).toUpperCase() || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
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
                    Payment Status:{" "}
                    <span className="font-semibold">
                      {order.payment?.status || "Pending"}
                    </span>
                  </p>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {orderProducts[order._id] ? (
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {orderProducts[order._id].image ? (
                            <img
                              src={api.products.getImage(
                                orderProducts[order._id].image
                              )}
                              alt={orderProducts[order._id].name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
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
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {orderProducts[order._id].name}
                          </h4>
                          {order.isAuction && (
                            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                              Auction Win
                            </span>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            Price: PKR{" "}
                            {orderProducts[order._id].price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
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
                            {order.total_amount
                              ? `Total: PKR ${order.total_amount.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
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
                    {(order.delivery_status
                      ?.toLowerCase()
                      .includes("delivered") ||
                      order.delivery_status
                        ?.toLowerCase()
                        .includes("completed") ||
                      order.payment?.status?.toLowerCase() === "completed") && (
                      <button
                        onClick={async () => {
                          try {
                            // Fetch order items to get the actual product ID
                            const itemsResponse =
                              (await api.orders.getOrderItems(
                                user?.id || "",
                                order._id
                              )) as any;

                            if (
                              itemsResponse?.items &&
                              itemsResponse.items.length > 0
                            ) {
                              const firstItem = itemsResponse.items[0];
                              setSelectedProduct({
                                id: firstItem.listingId || firstItem.partId,
                                name:
                                  firstItem.productName ||
                                  `Order #${order._id?.substring(0, 8).toUpperCase() || "N/A"}`,
                              });
                            } else {
                              // Fallback: use order ID if no items found
                              setSelectedProduct({
                                id: order._id,
                                name: `Order #${order._id?.substring(0, 8).toUpperCase() || "N/A"}`,
                              });
                            }
                            setReviewDialogOpen(true);
                          } catch (error) {
                            console.error(
                              "Failed to fetch order items:",
                              error
                            );
                            alert(
                              "Unable to load order details. Please try again."
                            );
                          }
                        }}
                        className="px-6 py-2 border-2 border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "auctions" && wonAuctions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wonAuctions.map((auction) => {
              const product = auction.partId;
              const productImage = product?.imageIds?.[0]?.fileName;

              return (
                <div
                  key={auction._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Auction Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Auction #
                          {auction._id?.substring(0, 8).toUpperCase() || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Won on{" "}
                          {auction.closedAt
                            ? new Date(auction.closedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2 rounded-full text-sm font-semibold capitalize bg-green-100 text-green-800">
                          Won
                        </span>
                        <p className="text-lg font-bold text-gray-900">
                          PKR {auction.current_price?.toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Auction Product */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {productImage ? (
                            <img
                              src={api.products.getImage(productImage)}
                              alt={product?.name || "Auction Item"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
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
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {product?.name || "Auction Item"}
                          </h4>
                          <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            Auction Win
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Winning Bid: PKR{" "}
                            {auction.current_price?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Auction Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to="/checkout"
                        state={{
                          auctionData: {
                            auctionId: auction._id,
                            productName: product?.name || "Auction Item",
                            amount: auction.current_price,
                            productImage: productImage,
                          },
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                      >
                        Proceed to Checkout
                      </Link>
                      <Link
                        to={`/auctions/${auction._id}`}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Auction
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            setSelectedProduct({
                              id: product?._id || auction._id,
                              name:
                                product?.name ||
                                `Auction #${auction._id?.substring(0, 8).toUpperCase() || "N/A"}`,
                            });
                            setReviewDialogOpen(true);
                          } catch (error) {
                            console.error(
                              "Failed to open review dialog:",
                              error
                            );
                            alert("Unable to open review. Please try again.");
                          }
                        }}
                        className="px-6 py-2 border-2 border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                        Leave Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              {activeTab === "orders" ? "No Orders Yet" : "No Won Auctions Yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "orders"
                ? "Start shopping to see your orders here"
                : "Participate in auctions to see your wins here"}
            </p>
            <Link
              to={activeTab === "orders" ? "/products" : "/auctions"}
              className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
            >
              {activeTab === "orders" ? "Browse Products" : "Browse Auctions"}
            </Link>
          </div>
        )}

        {/* Review Dialog */}
        {selectedProduct && (
          <ReviewDialog
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            isOpen={reviewDialogOpen}
            onClose={() => {
              setReviewDialogOpen(false);
              setSelectedProduct(null);
            }}
            onReviewSubmitted={() => {
              // Optionally refresh orders here
            }}
          />
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
