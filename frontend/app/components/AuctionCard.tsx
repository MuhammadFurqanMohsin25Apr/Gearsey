import { Link } from "react-router";
import type { Auction, Listing } from "~/types";
import { formatPrice, getConditionBadgeColor, truncateText } from "~/lib/utils";
import { api } from "~/lib/api";
import { Flame, Gavel, Store, BadgeCheck, Clock } from "lucide-react";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  // Type guard to ensure partId is populated
  if (!auction.partId || typeof auction.partId === "string") {
    return null;
  }

  const product = auction.partId;
  const firstImage = product.imageIds[0];
  const imageUrl = firstImage
    ? api.products.getImage(firstImage.fileName)
    : "/placeholder.png";

  // Generate random rating for demo (in production, use actual ratings)
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 50) + 10;

  // Mock seller data (in production, fetch from API)
  const sellerRating = (4.5 + Math.random() * 0.5).toFixed(1);
  // Calculate time remaining
  const endTime = new Date(auction.end_time);
  const now = new Date();
  const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const timeText =
    daysRemaining > 0
      ? `${daysRemaining}d ${hoursRemaining}h`
      : hoursRemaining > 0
        ? `${hoursRemaining}h`
        : "Ending soon";

  return (
    <Link
      to={`/auctions/${auction._id}`}
      className="group bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-red-300 flex flex-col sm:flex-row h-full"
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-48 md:w-56 aspect-square sm:aspect-auto sm:h-full overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-2 item-center justify-start pl-2">
          {/* Auction Badge */}
          <div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-1 sm:py-1.5 rounded-lg font-medium text-xs shadow-lg flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4" /> LIVE AUCTION
            </div>
          </div>

          {/* Condition Badge */}
          <div>
            <span
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shadow-lg ${getConditionBadgeColor(
                product.condition
              )}`}
            >
              {product.condition.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {auction.status !== "Active" && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg sm:rounded-xl text-base sm:text-lg font-black text-gray-800 shadow-2xl">
              {auction.status}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white rounded-lg font-bold text-sm sm:text-base text-gray-900 shadow-xl transition-all duration-300">
            View Auction
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between ">
        <div>
          {/* Category */}
          <p className="text-xs text-red-600 font-bold mb-1.5 sm:mb-2 uppercase tracking-wide">
            {typeof product.categoryId === "object"
              ? product.categoryId.name
              : "Category"}
          </p>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Auction Details */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              Current Bid
            </span>
            <span className="text-base font-bold text-red-600 whitespace-nowrap">
              {formatPrice(auction.current_price)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              Starting Price
            </span>
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              {formatPrice(auction.start_price)}
            </span>
          </div>
        </div>

        {/* Time Remaining or Winner */}
        {auction.status === "Active" ? (
          <div className="flex items-center gap-1.5 mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 rounded-lg">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-red-600">
              Ends in {timeText}
            </span>
          </div>
        ) : auction.status === "Closed" && auction.winnerId ? (
          <div className="mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🏆</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-800">
                  Winner:{" "}
                  {typeof auction.winnerId === "object"
                    ? auction.winnerId.name
                    : "Anonymous"}
                </span>
                <span className="text-xs text-amber-700">
                  Final Bid: {formatPrice(auction.current_price)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* CTA Button */}
        <button className="w-full px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg sm:hover:shadow-xl flex items-center justify-center gap-1">
          <Gavel className="w-3 h-3 sm:w-4 sm:h-4" /> PLACE BID NOW
        </button>
      </div>
    </Link>
  );
}
