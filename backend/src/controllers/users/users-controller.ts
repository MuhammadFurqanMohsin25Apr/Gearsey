import { type Request, type Response } from "express";
import { auth } from "@/lib/auth.js";

export async function getTotalUsersCount(req: Request, res: Response) {
  try {
    console.log("Fetching total buyers count...");
    // Get the MongoDB client from better-auth
    const database = await auth.options.database;

    if (!database) {
      console.error("Database connection failed");
      return res.status(500).json({ message: "Database connection failed" });
    }

    // Count only buyers from the users collection
    const usersCollection = database.collection("user");
    const totalUsers = await usersCollection.countDocuments({ role: "buyer" });
    console.log("Total buyers count:", totalUsers);
    res.status(200).json({
      message: "Total buyers count fetched successfully",
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users count:", error);
    res.status(400).json({
      message: "Failed to fetch users count",
      error: (error as Error).message,
    });
  }
}

export async function getAllBuyers(req: Request, res: Response) {
  try {
    // Get the MongoDB client from better-auth
    const database = auth.db;

    if (!database) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    // Fetch all buyers from the users collection
    const usersCollection = database.collection("user");
    const buyers = await usersCollection
      .find({ role: "buyer" })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        createdAt: 1,
        emailVerified: 1,
        image: 1,
      })
      .toArray();

    res.status(200).json({
      message: "Buyers fetched successfully",
      buyers,
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(400).json({
      message: "Failed to fetch buyers",
      error: (error as Error).message,
    });
  }
}
