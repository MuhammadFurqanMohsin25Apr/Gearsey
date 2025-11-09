import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI as string);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log("Connected to Mongo database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};
