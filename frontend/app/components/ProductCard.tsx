import { Link } from "react-router";
import type { Listing } from "~/types";
import { formatPrice, getConditionBadgeColor, truncateText } from "~/lib/utils";
import { api } from "~/lib/api";

interface ProductCardProps {
  product: Listing;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.imageIds[0];
  const imageUrl = firstImage
    ? api.products.getImage(firstImage.fileName)
    : "/placeholder.png";

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionBadgeColor(
              product.condition
            )}`}
          >
            {product.condition}
          </span>
          {product.is_auction && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              🔥 Auction
            </span>
          )}
        </div>

        {/* Status badge */}
        {product.status !== "Active" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg text-lg font-bold text-gray-800">
              {product.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-blue-600 font-medium mb-1">
          {typeof product.categoryId === "object"
            ? product.categoryId.name
            : "Category"}
        </p>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.is_auction && (
              <p className="text-xs text-gray-500 mt-1">Starting bid</p>
            )}
          </div>

          {/* View button */}
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            {product.is_auction ? "Bid Now" : "View Details"}
          </button>
        </div>
      </div>
    </Link>
  );
}
