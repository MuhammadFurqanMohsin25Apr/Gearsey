import { Link } from "react-router";
import { api } from "~/lib/api";
import type { Listing } from "~/types";
import {
  formatPrice,
  formatDate,
  getConditionBadgeColor,
  getStatusBadgeColor,
} from "~/lib/utils";
import { useState } from "react";
import { useAuth } from "~/lib/auth-context";

export function meta() {
  return [
    { title: `Product Details - Gearsey` },
    {
      name: "description",
      content: "View product details and make a purchase",
    },
  ];
}

export async function loader({ params }: { params: { id: string } }) {
  try {
    const response = (await api.products.getAll({ limit: 100 })) as any;
    const product = response.products.find((p: Listing) => p._id === params.id);

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    // Get related products from same category
    const relatedResponse = (await api.products.getAll({
      limit: 4,
      category:
        typeof product.categoryId === "object"
          ? product.categoryId.name
          : undefined,
    })) as any;

    const relatedProducts = relatedResponse.products.filter(
      (p: Listing) => p._id !== product._id
    );

    return { product, relatedProducts };
  } catch (error) {
    throw new Response("Failed to load product", { status: 500 });
  }
}

type LoaderData = {
  product: Listing;
  relatedProducts: Listing[];
};

export default function ProductDetail({
  loaderData,
}: {
  loaderData: LoaderData;
}) {
  const { product, relatedProducts } = loaderData;
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Review state
  const [reviews, setReviews] = useState<any[]>([
    // Mock reviews
    { id: 1, userName: "Ahmed Khan", rating: 5, comment: "Excellent quality! Exactly as described. Highly recommended.", date: "2024-01-15", verified: true },
    { id: 2, userName: "Fatima Ali", rating: 4, comment: "Good product, delivery was fast.", date: "2024-01-10", verified: true },
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const images = product.imageIds.map((img) =>
    api.products.getImage(img.fileName)
  );

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Added ${quantity} item(s) to cart!`);
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== "buyer") {
      alert("Only buyers can submit reviews!");
      return;
    }
    
    // Add review
    const review = {
      id: reviews.length + 1,
      userName: user.name || "Anonymous Buyer",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
    setShowReviewForm(false);
    alert("Review submitted successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">
            {typeof product.categoryId === "object"
              ? product.categoryId.name
              : "Product"}
          </span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImageIndex] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-blue-600"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getConditionBadgeColor(
                    product.condition
                  )}`}
                >
                  {product.condition}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
                {product.is_auction && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    🔥 Auction
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Category */}
              <p className="text-blue-600 font-medium mb-4">
                {typeof product.categoryId === "object"
                  ? product.categoryId.name
                  : "Category"}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.is_auction && (
                  <p className="text-sm text-gray-500 mt-1">
                    Starting bid price
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Details
                </h2>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Condition:</dt>
                    <dd className="text-gray-900 font-medium">
                      {product.condition}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Status:</dt>
                    <dd className="text-gray-900 font-medium">
                      {product.status}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Listed:</dt>
                    <dd className="text-gray-900">
                      {formatDate(product.createdAt)}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Product ID:</dt>
                    <dd className="text-gray-900 font-mono text-sm">
                      {product._id}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              {product.status === "Active" && (
                <div className="border-t border-gray-200 pt-6">
                  {product.is_auction ? (
                    <Link
                      to={`/auctions/${product._id}`}
                      className="block w-full px-6 py-4 bg-red-600 text-white text-center font-bold rounded-lg hover:bg-red-700 transition-colors text-lg"
                    >
                      Place Bid on Auction
                    </Link>
                  ) : (
                    <div>
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-gray-700 font-medium">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-6 py-2 border-x border-gray-300">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to="/checkout"
                          className="flex-1 px-6 py-4 bg-green-600 text-white text-center font-bold rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.status === "Sold" && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-gray-700 font-semibold">
                      This item has been sold
                    </p>
                  </div>
                </div>
              )}

              {/* Seller Info */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Seller Information
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Seller ID: {product.sellerId}
                    </p>
                    <p className="text-sm text-gray-600">Verified Seller ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="text-gray-600 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            
            {/* Only buyers can write reviews */}
            {user?.role === "buyer" && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-colors"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Review Form (Buyers Only) */}
          {showReviewForm && user?.role === "buyer" && (
            <form onSubmit={handleSubmitReview} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      {star <= newReview.rating ? "⭐" : "☆"}
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">{newReview.rating}/5</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  rows={4}
                  placeholder="Tell us about your experience with this product..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Message for non-buyers */}
          {!user && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6 border-2 border-amber-200">
              <p className="text-amber-800 font-medium">
                <Link to="/login" className="underline hover:text-amber-900">Sign in as a buyer</Link> to write a review
              </p>
            </div>
          )}
          
          {user && user.role !== "buyer" && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border-2 border-purple-200">
              <p className="text-purple-800 font-medium">Only buyers can submit product reviews</p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-lg font-medium">No reviews yet</p>
                <p className="text-sm mt-1">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{review.userName}</p>
                        {review.verified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">✓ Verified Purchase</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-yellow-400">
                          {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={
                        relatedProduct.imageIds[0]
                          ? api.products.getImage(
                              relatedProduct.imageIds[0].fileName
                            )
                          : "/placeholder.png"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
