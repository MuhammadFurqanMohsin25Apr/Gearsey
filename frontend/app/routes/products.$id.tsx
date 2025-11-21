import { Link, useNavigate, useLoaderData } from "react-router";
import { api } from "~/lib/api";
import type { Listing } from "~/types";
import {
  formatPrice,
  formatDate,
  getConditionBadgeColor,
  getStatusBadgeColor,
} from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import { Flame, CheckCircle, Star, Package } from "lucide-react";
import { ReviewDialog } from "~/components/ReviewDialog";
import { ReviewsList } from "~/components/ReviewsList";

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
    const product = response.products?.find(
      (p: Listing) => p._id === params.id
    );

    if (!product) {
      return { product: null, relatedProducts: [], auction: null };
    }

    // Get related products from same category
    const relatedResponse = (await api.products.getAll({
      limit: 4,
      category:
        typeof product.categoryId === "object"
          ? product.categoryId.name
          : undefined,
    })) as any;

    const relatedProducts =
      relatedResponse.products?.filter((p: Listing) => p._id !== product._id) ||
      [];

    // If this is an auction product, find the auction
    let auction = null;
    if (product.is_auction) {
      const auctionsData = (await api.auctions.getAll({ limit: 100 })) as any;
      auction = auctionsData.auctions?.find(
        (a: any) => a.partId === product._id
      );
    }

    return { product, relatedProducts, auction };
  } catch (error) {
    console.error("Failed to load product:", error);
    return { product: null, relatedProducts: [], auction: null };
  }
}

type LoaderData = {
  product: Listing;
  relatedProducts: Listing[];
  auction: any;
};

export default function ProductDetail() {
  const { product, relatedProducts, auction } = useLoaderData<LoaderData>();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This product could not be loaded. Please try again later.
          </p>
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = (await api.reviews.getByProduct(product._id)) as any;
        setReviews(response.reviews || []);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product._id]);

  const images = product.imageIds.map((img) =>
    api.products.getImage(img.fileName)
  );

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!session) {
      // Not authenticated - redirect to login
      navigate("/login");
      return;
    }

    // Add to cart
    cartManager.addItem(product, quantity);
    alert(`Added ${quantity} item(s) to cart!`);

    // Reset quantity
    setQuantity(1);
  };

  const handleReviewSubmitted = async () => {
    // Reload reviews after submission
    try {
      const response = (await api.reviews.getByProduct(product._id)) as any;
      setReviews(response.reviews || []);
    } catch (error) {
      console.error("Failed to reload reviews:", error);
    }
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
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                    <Flame className="w-4 h-4" /> Auction
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
                    auction ? (
                      <Link
                        to={`/auctions/${auction._id}`}
                        className="block w-full px-6 py-4 bg-red-600 text-white text-center font-bold rounded-lg hover:bg-red-700 transition-colors text-lg"
                      >
                        Place Bid on Auction
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="block w-full px-6 py-4 bg-gray-400 text-white text-center font-bold rounded-lg text-lg cursor-not-allowed"
                      >
                        Auction Not Found
                      </button>
                    )
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
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      Verified Seller <CheckCircle className="w-4 h-4" />
                    </p>
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
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              <p className="text-gray-600 mt-1">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Only logged in users can write reviews */}
            {user && (
              <button
                onClick={() => setShowReviewDialog(true)}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Message for non-logged in users */}
          {!user && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6 border-2 border-red-200">
              <p className="text-red-800 font-medium">
                <Link to="/login" className="underline hover:text-red-900">
                  Sign in
                </Link>{" "}
                to write a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <ReviewsList reviews={reviews} isLoading={reviewsLoading} />
        </div>

        {/* Review Dialog */}
        <ReviewDialog
          productId={product._id}
          productName={product.title}
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />

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
