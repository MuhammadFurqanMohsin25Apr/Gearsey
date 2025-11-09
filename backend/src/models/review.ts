import { Document, model, Model, Schema, type WithTimestamps } from "mongoose";

interface IReview extends WithTimestamps<Document> {
  userId: string;
  partId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment: string;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  partId: { type: String, required: true },
  rating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: true,
  },
  comment: { type: String, required: true },
}, { timestamps: true });

export const Review: Model<IReview> = model<IReview>("Review", ReviewSchema);

