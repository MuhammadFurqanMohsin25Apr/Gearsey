import { Document, model, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  total_amount: number;
  payment_status: "Pending" | "Paid" | "Failed" | "Refunded";
  delivery_status: "Pending" | "Dispatched" | "Delivered" | "Cancelled";
  platform_fee: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    total_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    delivery_status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    platform_fee: { type: Number, required: true, default: 7},
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
