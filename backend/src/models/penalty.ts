import { Document, model, Schema } from "mongoose";

export interface IPenalty extends Document {
  userId: string;
  auctionId: string;
  productId: string;
  amount: number;
  reason: "non_payment_overdue";
  paymentDeadline: Date;
  status: "pending" | "paid" | "enforced";
  createdAt: Date;
  updatedAt: Date;
}

const penaltySchema = new Schema<IPenalty>(
  {
    userId: { type: String, required: true, ref: "User" },
    auctionId: { type: String, required: true, ref: "Auction" },
    productId: { type: String, required: true, ref: "Listing" },
    amount: { type: Number, required: true },
    reason: { type: String, enum: ["non_payment_overdue"], required: true },
    paymentDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "enforced"],
      default: "pending",
    },
  },
  { timestamps: true }
);

penaltySchema.index({ userId: 1, status: 1 });
penaltySchema.index({ auctionId: 1 });
penaltySchema.index({ paymentDeadline: 1 });

export const Penalty = model<IPenalty>("Penalty", penaltySchema);
