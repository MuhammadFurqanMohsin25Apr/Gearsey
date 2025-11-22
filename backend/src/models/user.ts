import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true, collection: "user" } // Explicitly map to 'user' collection used by better-auth
);

export const User = model<IUser>("User", userSchema);
