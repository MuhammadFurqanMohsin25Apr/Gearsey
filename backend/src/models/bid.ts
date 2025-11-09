import { Document, model, Model, Schema } from "mongoose";

export interface IBid extends Document {
    auctionId: string;
    userId: string;
    bid_amount: number;
}

const bidSchema = new Schema<IBid>({
    auctionId: { type: String, required: true },
    userId: { type: String, required: true },
    bid_amount: { type: Number, required: true },
}, { timestamps: true });

export const Bid: Model<IBid> = model<IBid>('Bid', bidSchema);