import { Link } from "react-router";
import type { Listing } from "~/types";
import { formatPrice, getConditionBadgeColor, truncateText } from "~/lib/utils";
import { api } from "~/lib/api";
import { Flame, Gavel, Store, BadgeCheck } from "lucide-react";

interface ProductCardProps {
  product: Listing;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.imageIds[0];
  const imageUrl = firstImage
    ? api.products.getImage(firstImage.fileName)
    : "/placeholder.png";

  // Generate random rating for demo (in production, use actual ratings)
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 50) + 10;
  const discount = product.is_auction ? 0 : Math.floor(Math.random() * 30) + 10;

  // Mock seller data (in production, fetch from API)
  const sellerRating = (4.5 + Math.random() * 0.5).toFixed(1);
  const sellerName =
    typeof product.sellerId === "object" && product.sellerId?.name
      ? product.sellerId.name
      : "Quality Parts";

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-red-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Sale/Discount Badge */}
        {discount > 0 && !product.is_auction && (
          <div className="absolute top-3 left-3">
            <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-black text-sm shadow-lg">
              -{discount}%
            </div>
          </div>
        )}

        {/* Auction Badge */}
        {product.is_auction && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg flex items-center gap-1 animate-pulse">
              <Flame className="w-4 h-4" /> AUCTION
            </div>
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${getConditionBadgeColor(
              product.condition
            )}`}
          >
            {product.condition.toUpperCase()}
          </span>
        </div>

        {/* Status Overlay */}
        {product.status !== "Active" && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="px-6 py-3 bg-white rounded-xl text-lg font-black text-gray-800 shadow-2xl">
              {product.status}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="px-6 py-2 bg-white rounded-lg font-bold text-gray-900 shadow-xl transition-all duration-300">
            Quick View
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-red-600 font-bold mb-2 uppercase tracking-wide">
          {typeof product.categoryId === "object"
            ? product.categoryId.name
            : "Category"}
        </p>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
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
          <span className="text-xs text-gray-600">({reviews})</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
          <Store className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-600 flex items-center gap-1">
            {sellerName}
            <BadgeCheck className="w-3 h-3 text-blue-500" />
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-700">
            <svg
              className="w-3 h-3 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            {sellerRating}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mb-4">
          <div>
            {discount > 0 && !product.is_auction && (
              <div className="text-sm text-gray-400 line-through mb-1">
                PKR{" "}
                {Math.floor(
                  product.price * (1 + discount / 100)
                ).toLocaleString()}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.is_auction && (
                <span className="text-xs text-gray-500 font-medium">
                  starting
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2">
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
