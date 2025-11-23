import { Document, model, Model, Schema, type WithTimestamps } from "mongoose";
import { ObjectId } from "mongodb";

export interface IListing extends WithTimestamps<Document> {
  name: string;
  description: string;
  price: number;
  platform_fee: number;
  imageIds: ObjectId[];
  sellerId: ObjectId;
  categoryId: ObjectId;
  condition: "New" | "Used" | "Refurbished";
  is_auction: boolean;
  status: "Active" | "Sold" | "Removed";
}

const ListingSchema = new Schema<IListing>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  platform_fee: { type: Number, required: true, default: 0 },
  imageIds: [{ type: Schema.Types.ObjectId, required: true, ref: 'Image' }],
  sellerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  condition: {
    type: String,
    enum: ["New", "Used", "Refurbished"],
    required: true,
  },
  is_auction: { type: Boolean, required: true },
  status: {
    type: String,
    enum: ["Active", "Sold", "Removed"],
    default: "Active",
    required: true,
  },
}, { timestamps: true });

ListingSchema.index({ name: "text", description: "text" });

export const Listing: Model<IListing> = model<IListing>("Listing", ListingSchema);
