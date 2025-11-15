import React, { useEffect, useState } from "react";
import { CreditCard, DollarSign, Search, TrendingUp } from "lucide-react";
import { api } from "~/lib/api";

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
  });

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const paymentsData: any = await api.payments
          .getAll({ limit: 1000 })
          .catch(() => ({ data: [] }));

        if (paymentsData.data && Array.isArray(paymentsData.data)) {
          const formattedPayments = paymentsData.data.map((p: any) => ({
            id: p._id,
            orderId: p.orderId,
            paymentMethod: p.payment_method,
            amount: p.amount,
            status: p.status,
            date: new Date(p.createdAt).toISOString().split("T")[0],
            time: new Date(p.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setPayments(formattedPayments);

          // Calculate stats
          const totalAmount = formattedPayments.reduce(
            (sum: number, p: any) => sum + p.amount,
            0
          );
          const completedCount = formattedPayments.filter(
            (p: any) => p.status === "Completed"
          ).length;
          const pendingCount = formattedPayments.filter(
            (p: any) => p.status === "Pending"
          ).length;

          setStats({
            totalPayments: formattedPayments.length,
            totalAmount,
            completedPayments: completedCount,
            pendingPayments: pendingCount,
          });
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleRefundPayment = async (paymentId: string) => {
    if (
      confirm(
        "Are you sure you want to refund this payment? This action cannot be undone."
      )
    ) {
      try {
        await api.payments.refund({ paymentId });

        // Update local state
        setPayments(
          payments.map((p) =>
            p.id === paymentId ? { ...p, status: "Refunded" } : p
          )
        );

        // Recalculate stats
        const updatedPayments = payments.map((p) =>
          p.id === paymentId ? { ...p, status: "Refunded" } : p
        );
        const completedCount = updatedPayments.filter(
          (p: any) => p.status === "Completed"
        ).length;
        const pendingCount = updatedPayments.filter(
          (p: any) => p.status === "Pending"
        ).length;

        setStats({
          ...stats,
          completedPayments: completedCount,
          pendingPayments: pendingCount,
        });

        alert("Payment refunded successfully!");
      } catch (error) {
        console.error("Failed to refund payment:", error);
        alert("Failed to refund payment");
      }
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    if (confirm("Mark this payment as completed?")) {
      try {
        await api.payments.process({ paymentId });

        // Update local state
        setPayments(
          payments.map((p) =>
            p.id === paymentId ? { ...p, status: "Completed" } : p
          )
        );

        // Recalculate stats
        const updatedPayments = payments.map((p) =>
          p.id === paymentId ? { ...p, status: "Completed" } : p
        );
        const completedCount = updatedPayments.filter(
          (p: any) => p.status === "Completed"
        ).length;
        const pendingCount = updatedPayments.filter(
          (p: any) => p.status === "Pending"
        ).length;

        setStats({
          ...stats,
          completedPayments: completedCount,
          pendingPayments: pendingCount,
        });

        alert("Payment processed successfully!");
      } catch (error) {
        console.error("Failed to process payment:", error);
        alert("Failed to process payment");
      }
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      (filterStatus === "all" ||
        p.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (searchQuery === "" ||
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-opacity-20 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.totalPayments}</h3>
          <p className="text-blue-100 text-sm">Total Payments</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            PKR {stats.totalAmount.toLocaleString()}
          </h3>
          <p className="text-green-100 text-sm">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.completedPayments}</h3>
          <p className="text-emerald-100 text-sm">Completed Payments</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-opacity-20 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.pendingPayments}</h3>
          <p className="text-yellow-100 text-sm">Pending Payments</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Payment Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all payment transactions in your marketplace
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by Order ID..."
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {payment.orderId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {payment.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-gray-900">
                        PKR {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                          payment.status === "Completed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : payment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : payment.status === "Failed"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {payment.date}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.time}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {payment.status === "Pending" && (
                          <button
                            onClick={() => handleProcessPayment(payment.id)}
                            className="text-green-600 hover:text-green-800 hover:underline transition-colors text-sm font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {payment.status === "Completed" && (
                          <button
                            onClick={() => handleRefundPayment(payment.id)}
                            className="text-red-600 hover:text-red-800 hover:underline transition-colors text-sm font-medium"
                          >
                            Refund
                          </button>
                        )}
                        {(payment.status === "Failed" ||
                          payment.status === "Refunded") && (
                          <span className="text-gray-400 text-sm">
                            No actions
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <CreditCard className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No payments found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchQuery || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Payments will appear here once orders are placed"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
