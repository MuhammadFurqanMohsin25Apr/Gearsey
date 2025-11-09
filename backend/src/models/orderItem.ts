import { Document, Model, model, Schema } from "mongoose";

export interface IOrderItem extends Document{
  orderId: string;
  partId: string;
  quantity: number;
  price: number;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: String, required: true },
    partId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderItem: Model<IOrderItem> = model<IOrderItem>(
  "OrderItem",
  orderItemSchema
);
