import { Document, model, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  total_amount: number;
  delivery_status: "Pending" | "Dispatched" | "Delivered" | "Cancelled";
  platform_fee: number;
  isAuction?: boolean;
  auctionId?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    total_amount: { type: Number, required: true },
    delivery_status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    platform_fee: { type: Number, required: true, default: 7 },
    isAuction: { type: Boolean, default: false },
    auctionId: { type: String, required: false },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
