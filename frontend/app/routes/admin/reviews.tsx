import { CheckCircle, Package, Star } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "~/lib/api";

interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.reviews.getAll() as any;
        
        if (response.reviews && Array.isArray(response.reviews)) {
          const formattedReviews = response.reviews.map((r: any) => ({
            id: r._id,
            productId: r.partId,
            productName: r.productName || "Product",
            userName: r.userId,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }));
          setReviews(formattedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await api.reviews.delete(reviewId);
        setReviews(reviews.filter((r) => r.id !== reviewId));
        alert("Review deleted successfully!");
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading reviews...</p>
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
              Review Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Monitor and moderate customer reviews
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars</option>
              <option>1 Star</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-red-600 to-red-700 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.userName[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {review.userName}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
                >
                  Delete
                </button>
              </div>

              <Link
                to={`/products/${review.productId}`}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold mb-3 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <Package className="w-4 h-4" /> {review.productName}
              </Link>

              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {review.comment}
              </p>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm text-gray-400 mt-1">
              Reviews will appear here when customers leave feedback
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
