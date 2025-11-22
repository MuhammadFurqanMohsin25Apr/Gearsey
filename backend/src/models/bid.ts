import { Document, model, Model, Schema } from "mongoose";

export interface IBid extends Document {
    auctionId: string;
    userId: string;
    bid_amount: number;
    createdAt: Date;
    updatedAt: Date;
}

const bidSchema = new Schema<IBid>({
    auctionId: { type: String, required: true, ref: 'Auction' },
    userId: { type: String, required: true, ref: 'User' },
    bid_amount: { type: Number, required: true },
}, { timestamps: true });

bidSchema.index({ auctionId: 1, createdAt: -1 });
bidSchema.index({ userId: 1, createdAt: -1 });

export const Bid: Model<IBid> = model<IBid>('Bid', bidSchema);