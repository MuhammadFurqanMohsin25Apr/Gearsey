import apiClient from '@/lib/api-client';
import type { Review, ReviewsResponse, CreateReviewFormData } from '@/types';

export const reviewService = {
  // Get all reviews
  getAllReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<ReviewsResponse>('/api/review');
    return response.data.reviews;
  },

  // Get reviews for a specific product
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const response = await apiClient.get<ReviewsResponse>(
      `/api/review/${productId}`
    );
    return response.data.reviews;
  },

  // Get reviews by a specific user
  getUserReviews: async (userId: string): Promise<Review[]> => {
    const response = await apiClient.get<ReviewsResponse>(
      `/api/review/user/${userId}`
    );
    return response.data.reviews;
  },

  // Create a new review
  createReview: async (data: CreateReviewFormData): Promise<Review> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await apiClient.post<{ message: string; review: Review }>(
      '/api/review',
      {
        userId: user.id,
        ...data,
      }
    );
    return response.data.review;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/api/review/${reviewId}`);
  },
};
