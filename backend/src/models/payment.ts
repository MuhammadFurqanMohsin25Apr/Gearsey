import { Document, Model, model, Schema } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  payment_method:
    | "Credit Card"
    | "Debit Card";
  amount: number;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true },
    payment_method: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "Cash On Delivery",
        "EasyPaisa",
        "Bank Transfer",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> = model<IPayment>(
  "Payment",
  paymentSchema
);
