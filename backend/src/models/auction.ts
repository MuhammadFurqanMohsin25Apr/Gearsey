import { Document, model, Schema } from "mongoose";

export interface IAuction extends Document {
    partId: string;
    start_price: number;
    current_price: number;
    start_time: Date;
    end_time: Date;
    status: 'Active' | 'Closed' | 'Cancelled';
    winnerId: string;
}

const auctionSchema = new Schema<IAuction>({
    partId: { type: String, required: true },
    start_price: { type: Number, required: true },
    current_price: { type: Number, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Closed', 'Cancelled'], required: true },
    winnerId: { type: String, required: false },
})

export const Auction = model<IAuction>('Auction', auctionSchema);