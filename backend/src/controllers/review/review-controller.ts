import { Review } from "@/models/review.js";
import { type Request, type Response } from "express";

export async function getAllReviews(req: Request, res: Response) {
  try {
    const { limit } = req.query;

    const reviews = await Review.find().limit(limit ? Number(limit) : 10);

    res.status(200).json({
      message: "Reviews fetched successfully",
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching reviews",
      error: (err as Error).message,
    });
  }
}

export async function getProductReviews(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const { limit } = req.query;

    if (!productId) {
      return res.status(404).json({
        message: "Product ID is required",
      });
    }

    // Get the most recent reviews for the product
    const reviews = await Review.find({ partId: productId })
      .limit(limit ? Number(limit) : 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Product reviews fetched successfully",
      reviews,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching product reviews",
      error: (err as Error).message,
    });
  }
}

export async function getUserReviews(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    if (!userId) {
      return res.status(404).json({
        message: "User ID is required",
      });
    }

    const reviews = await Review.find({ userId })
      .limit(limit ? Number(limit) : 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User reviews fetched successfully",
      reviews,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching user reviews",
      error: (err as Error).message,
    });
  }
}

export async function createReview(req: Request, res: Response) {
  try {
    const { userId, rating, comment, partId } = req.body;

    if (!userId || !rating || !partId) {
      throw new Error(
        "Part ID, User ID and Rating are required. Some are missing."
      );
    }

    const newReview = new Review({
      userId,
      partId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error creating review",
      error: (err as Error).message,
    });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(404).json({
        message: "Review ID is required",
      });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      throw new Error("Review not found");
    }

    res.status(200).json({
      message: "Review deleted successfully",
      review: deletedReview,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error deleting review",
      error: (err as Error).message,
    });
  }
}
