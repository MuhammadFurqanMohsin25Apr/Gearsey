import { Clock, Gavel, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "~/lib/api";
import type { Auction } from "~/types";
import { Link } from "react-router";

export default function AuctionManagement() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const response = (await api.auctions.getAll({ limit: 100 })) as any;
        const auctionsList = response.auctions || [];
        setAuctions(auctionsList);

        // Fetch bid counts for each auction
        const counts: Record<string, number> = {};
        await Promise.all(
          auctionsList.map(async (auction: Auction) => {
            try {
              const bidsResponse = await api.bids.getByAuction(auction._id);
              counts[auction._id] = bidsResponse.bids?.length || 0;
            } catch (error) {
              console.error(
                `Failed to fetch bids for auction ${auction._id}:`,
                error
              );
              counts[auction._id] = 0;
            }
          })
        );
        setBidCounts(counts);
      } catch (error) {
        console.error("Failed to load auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, []);

  const handleCloseAuction = async (auctionId: string, sellerId: string) => {
    if (confirm("Are you sure you want to close this auction?")) {
      try {
        await api.auctions.close(auctionId, sellerId || "", true);
        // Refresh auctions and bid counts
        const response = (await api.auctions.getAll({ limit: 100 })) as any;
        const auctionsList = response.auctions || [];
        setAuctions(auctionsList);

        const counts: Record<string, number> = {};
        await Promise.all(
          auctionsList.map(async (auction: Auction) => {
            try {
              const bidsResponse = await api.bids.getByAuction(auction._id);
              counts[auction._id] = bidsResponse.bids?.length || 0;
            } catch (error) {
              counts[auction._id] = 0;
            }
          })
        );
        setBidCounts(counts);
        alert("Auction closed successfully!");
      } catch (error) {
        console.error("Failed to close auction:", error);
        alert("Failed to close auction. Please try again.");
      }
    }
  };

  const handleCancelAuction = async (auctionId: string) => {
    if (confirm("Are you sure you want to cancel this auction?")) {
      try {
        await api.auctions.cancel(auctionId);
        // Refresh auctions and bid counts
        const response = (await api.auctions.getAll({ limit: 100 })) as any;
        const auctionsList = response.auctions || [];
        setAuctions(auctionsList);

        const counts: Record<string, number> = {};
        await Promise.all(
          auctionsList.map(async (auction: Auction) => {
            try {
              const bidsResponse = await api.bids.getByAuction(auction._id);
              counts[auction._id] = bidsResponse.bids?.length || 0;
            } catch (error) {
              counts[auction._id] = 0;
            }
          })
        );
        setBidCounts(counts);
        alert("Auction cancelled successfully!");
      } catch (error) {
        console.error("Failed to cancel auction:", error);
        alert("Failed to cancel auction. Please try again.");
      }
    }
  };

  const handleDeleteAuction = async (auctionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this auction? This action cannot be undone."
      )
    ) {
      try {
        await api.auctions.delete(auctionId);
        setAuctions(auctions.filter((a) => a._id !== auctionId));
        alert("Auction deleted successfully!");
      } catch (error) {
        console.error("Failed to delete auction:", error);
        alert("Failed to delete auction. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full"></div>
            <p className="text-gray-600 mt-4">Loading auctions...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeAuctions = auctions.filter((a) => a.status === "Active");
  const completedAuctions = auctions.filter((a) => a.status === "Completed");

  return (
    <div className="flex-1 p-4 lg:p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Auctions
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {auctions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gavel className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {activeAuctions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {completedAuctions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">All Auctions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Auction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Start Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Bids
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <tr
                    key={auction._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">
                        {auction._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          auction.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {auction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      PKR {auction.start_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-bold">
                      PKR {auction.current_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bidCounts[auction._id] || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(auction.end_time).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/auctions/${auction._id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </Link>
                        {auction.status === "Active" && (
                          <>
                            <button
                              onClick={() => {
                                const sellerId =
                                  typeof auction.partId === "object"
                                    ? auction.partId?.sellerId
                                    : "";
                                handleCloseAuction(auction._id, sellerId || "");
                              }}
                              className="text-orange-600 hover:text-orange-800 font-semibold"
                            >
                              Close
                            </button>
                            <button
                              onClick={() => handleCancelAuction(auction._id)}
                              className="text-yellow-600 hover:text-yellow-800 font-semibold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteAuction(auction._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No auctions found</p>
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
