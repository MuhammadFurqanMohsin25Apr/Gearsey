import { Document, model, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type:
    | "auction_won"
    | "auction_ended"
    | "auction_closed"
    | "payment_pending"
    | "payment_overdue";
  title: string;
  message: string;
  auctionId: string;
  productId: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, ref: "User" },
    type: {
      type: String,
      enum: [
        "auction_won",
        "auction_ended",
        "auction_closed",
        "payment_pending",
        "payment_overdue",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    auctionId: { type: String, required: true, ref: "Auction" },
    productId: { type: String, required: true, ref: "Listing" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
