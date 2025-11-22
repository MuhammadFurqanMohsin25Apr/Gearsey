import { Document, model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

export interface IAuction extends Document {
    partId: string;
    sellerId: string;
    start_price: number;
    current_price: number;
    start_time: Date;
    end_time: Date;
    status: 'Active' | 'Closed' | 'Cancelled';
    winnerId: string | null;
    paymentDeadline: Date | null;
    totalBids: number;
    closedAt: Date | null;
    closedBy: 'time_expired' | 'seller_closed' | 'cancelled';
}

const auctionSchema = new Schema<IAuction>({
    partId: { type: String, required: true, ref: 'Listing' },
    sellerId: { type: String, required: true, ref: 'User' },
    start_price: { type: Number, required: true },
    current_price: { type: Number, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Closed', 'Cancelled'], required: true, default: 'Active' },
    winnerId: { type: String, required: false, default: null, ref: 'User' },
    paymentDeadline: { type: Date, required: false, default: null },
    totalBids: { type: Number, required: true, default: 0 },
    closedAt: { type: Date, required: false, default: null },
    closedBy: { type: String, enum: ['time_expired', 'seller_closed', 'cancelled'], required: false },
}, { timestamps: true })

auctionSchema.index({ partId: 1 });
auctionSchema.index({ sellerId: 1 });
auctionSchema.index({ winnerId: 1 });
auctionSchema.index({ status: 1 });

export const Auction = model<IAuction>('Auction', auctionSchema);