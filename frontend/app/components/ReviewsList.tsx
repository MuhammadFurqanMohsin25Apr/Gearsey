import { Star } from "lucide-react";
import { formatDate } from "~/lib/utils";

interface Review {
  _id?: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export function ReviewsList({ reviews, isLoading }: ReviewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-32 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900">
                {review.userName || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">
                {review.createdAt ? formatDate(new Date(review.createdAt)) : ""}
              </p>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <p className="text-gray-700 text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
