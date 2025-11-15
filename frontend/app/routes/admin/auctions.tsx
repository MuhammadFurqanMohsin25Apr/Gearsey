import { Clock } from "lucide-react";
import React from "react";

export default function auctions() {
  return (
    <div className="flex-1 p-4 lg:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Auction Management
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Monitor live auctions, track bids, and manage auction listings in
            real-time
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md font-semibold">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
