import { Link } from "react-router";
import type { Listing, Review } from "~/types";
import { formatPrice, getConditionBadgeColor, truncateText } from "~/lib/utils";
import { api } from "~/lib/api";
import { Flame, Gavel, Store, BadgeCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Listing;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.imageIds[0];
  const imageUrl = firstImage
    ? api.products.getImage(firstImage.fileName)
    : "/placeholder.png";

  // State for reviews and rating
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.reviews.getByProduct(product._id);
        const fetchedReviews = (response as any).reviews || [];
        setReviews(fetchedReviews);
        setReviewCount(fetchedReviews.length);

        // Calculate average rating, default to 5 if no reviews
        if (fetchedReviews.length > 0) {
          const avgRating = fetchedReviews.reduce(
            (sum: number, review: Review) => sum + review.rating,
            0
          ) / fetchedReviews.length;
          setRating(avgRating);
        } else {
          setRating(5);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        // Default to 5 stars on error
        setRating(5);
        setReviewCount(0);
      }
    };

    fetchReviews();
  }, [product._id]);

  // Mock seller data (in production, fetch from API)
  const sellerRating = (4.5 + Math.random() * 0.5).toFixed(1);
  const sellerName =
    typeof product.sellerId === "object" && product.sellerId?.name
      ? product.sellerId.name
      : "Quality Parts";

  // Calculate time remaining for auctions
  const endTime = new Date(product.updatedAt);
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

  // If it's an auction, use the auction card layout
  if (product.is_auction) {
    return (
      <Link
        to={`/products/${product._id}`}
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
          {product.status !== "Active" && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg sm:rounded-xl text-base sm:text-lg font-black text-gray-800 shadow-2xl">
                {product.status}
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
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                Starting Price
              </span>
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Time Remaining */}
          {product.status === "Active" && (
            <div className="flex items-center gap-1.5 mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 rounded-lg">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-red-600">
                Ends in {timeText}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <button className="w-full px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg sm:hover:shadow-xl flex items-center justify-center gap-1">
            <Gavel className="w-3 h-3 sm:w-4 sm:h-4" /> PLACE BID NOW
          </button>
        </div>
      </Link>
    );
  }

  // Regular product card layout
  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-red-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Auction Badge */}
        {product.is_auction && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4" /> AUCTION
            </div>
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shadow-lg ${getConditionBadgeColor(
              product.condition
            )}`}
          >
            {product.condition.toUpperCase()}
          </span>
        </div>

        {/* Status Overlay */}
        {product.status !== "Active" && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg sm:rounded-xl text-base sm:text-lg font-black text-gray-800 shadow-2xl">
              {product.status}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white rounded-lg font-bold text-sm sm:text-base text-gray-900 shadow-xl transition-all duration-300">
            Quick View
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        {/* Top Section: Name/Category on Left, Rating/Price on Right */}
        <div className="flex justify-between gap-4 mb-2">
          {/* Left Side: Category and Product Name */}
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-xs text-red-600 font-bold uppercase">
              {typeof product.categoryId === "object"
                ? product.categoryId.name
                : "Category"}
            </p>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Right Side: Rating and Price */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 fill-current"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black mt-1 text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.is_auction && (
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                  start
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <Store className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 flex items-center gap-1 min-w-0 truncate">
            {sellerName}
            <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
          </span>
          <span className="ml-auto flex items-center gap-0.5 text-xs font-semibold text-gray-700 flex-shrink-0">
            <svg
              className="w-3 h-3 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            {sellerRating}
          </span>
        </div>

        {/* CTA Button - Full Width at Bottom */}
        <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg sm:hover:shadow-xl flex items-center justify-center gap-2 mt-auto">
          {product.is_auction ? (
            <>
              <Gavel className="w-4 h-4" /> PLACE BID
            </>
          ) : (
            "VIEW DETAILS"
          )}
        </button>
      </div>
    </Link>
  );
}
