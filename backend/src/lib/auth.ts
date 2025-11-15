import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import {admin} from "better-auth/plugins";
const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  appName: "gearsey-backend",
  plugins: [admin()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        default: "customer",
      },
      address: {
        type: "string",
        required: true,
      },
      phone: {
        type: "string",
        required: true,
      },
      rating: {
        type: "number",
        required: true,
        default: 0,
      },
      total_reviews: {
        type: "number",
        required: true,
        default: 0,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  trustedOrigins: ["http://localhost:5173"],
});
