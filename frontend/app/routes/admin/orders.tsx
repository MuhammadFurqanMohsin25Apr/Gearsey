import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { api } from "~/lib/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [orderPaymentStatus, setOrderPaymentStatus] = useState("");
  const [orderDeliveryStatus, setOrderDeliveryStatus] = useState("");

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = (await api.orders
          .getAll()
          .catch(() => ({ orders: [] }))) as { orders: any[] };

        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          const formattedOrders = ordersData.orders.map((o: any) => ({
            id: o._id,
            customer: o.userId,
            amount: o.total_amount,
            status: o.payment_status?.toLowerCase() || "pending",
            deliveryStatus: o.delivery_status?.toLowerCase() || "pending",
            date: new Date(o.createdAt).toISOString().split("T")[0],
          }));
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setOrderPaymentStatus(order.status || "pending");
    setOrderDeliveryStatus(order.deliveryStatus || "pending");
    setEditModalOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!editingOrder) return;

    try {
      await api.orders.update({
        orderId: editingOrder.id,
        payment_status: orderPaymentStatus,
        delivery_status: orderDeliveryStatus,
      });

      // Update local state
      setOrders(
        orders.map((o) =>
          o.id === editingOrder.id
            ? {
                ...o,
                status: orderPaymentStatus,
                deliveryStatus: orderDeliveryStatus,
              }
            : o
        )
      );

      setEditModalOpen(false);
      setEditingOrder(null);
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await api.orders.delete({ userId: "", orderId });
        setOrders(orders.filter((o) => o.id !== orderId));
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Failed to delete order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Order Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track orders, manage fulfillment, and handle customer transactions
              efficiently
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    <td className="px-4 py-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-bold">
                      PKR {order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          order.deliveryStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.deliveryStatus === "in-transit"
                              ? "bg-blue-100 text-blue-800"
                              : order.deliveryStatus === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.deliveryStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-4 py-2 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Order</h2>
            </div>

            <div className="px-4 py-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={editingOrder.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={orderPaymentStatus}
                  onChange={(e) => setOrderPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Status
                </label>
                <select
                  value={orderDeliveryStatus}
                  onChange={(e) => setOrderDeliveryStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
