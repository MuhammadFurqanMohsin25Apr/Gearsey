import { model, Schema, type Document, type ObjectId, type WithTimestamps } from "mongoose";

export interface IImage extends WithTimestamps<Document> {
  fileName: string;
  listingId: ObjectId;
  mime: "image/jpg" | "image/png";
  size: number; // Bytes
}

const imageSchema = new Schema<IImage>(
  {
    fileName: { type: String, required: true },
    mime: {
      type: String,
      required: true,
      enum: ["image/jpg", "image/png"],
      default: "image/jpg" as const,
    },
    size: { type: Number, required: true, default: 0 },
    listingId: { type: Schema.Types.ObjectId, required: true, ref: "Listing" },
  },
  { timestamps: true }
);

export const Image = model<IImage>("Image", imageSchema);
