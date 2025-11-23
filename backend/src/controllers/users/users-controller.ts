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
    const totalUsers = await usersCollection.countDocuments({
      userRole: "buyer",
    });
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
      .find({ userRole: "buyer" })
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

export async function getSellerStats(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    console.log("Fetching seller stats for userId:", userId);

    // Get the MongoDB database
    const database = auth.db;

    if (!database) {
      console.error("Database connection failed");
      return res.status(500).json({ message: "Database connection failed" });
    }

    const userCollection = database.collection("user");
    const listingCollection = database.collection("listing");
    const orderItemCollection = database.collection("orderitem");
    const reviewCollection = database.collection("review");

    // Get user info for member since date
    const user = await userCollection.findOne({ id: userId });

    // Count total products listed by seller
    const totalProducts = await listingCollection.countDocuments({
      sellerId: userId,
    });

    // Get all listings by this seller
    const sellerListings = await listingCollection
      .find({ sellerId: userId })
      .toArray();

    const listingIds = sellerListings.map((listing: any) =>
      listing._id.toString()
    );

    // Count active and sold listings
    const activeListings = await listingCollection.countDocuments({
      sellerId: userId,
      status: "Active",
    });

    const soldListings = await listingCollection.countDocuments({
      sellerId: userId,
      status: "Sold",
    });

    // Calculate total sales and revenue from order items
    const orderItems = await orderItemCollection
      .find({ partId: { $in: listingIds } })
      .toArray();

    const totalSales = orderItems.length;
    const totalRevenue = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Get reviews for seller's products
    const reviews = await reviewCollection
      .find({ listingId: { $in: listingIds } })
      .toArray();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
          totalReviews
        : 0;

    // Format member since date
    const memberSince = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "January 2024";

    res.status(200).json({
      message: "Seller stats fetched successfully",
      stats: {
        totalSales,
        totalRevenue,
        totalProducts,
        activeListings,
        soldListings,
        rating: parseFloat(averageRating.toFixed(1)),
        reviews: totalReviews,
        memberSince,
      },
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    res.status(500).json({
      message: "Failed to fetch seller stats",
      error: (error as Error).message,
    });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { name, phone, address } = req.body;

    console.log("Updating user profile for userId:", userId);
    console.log("Update data:", { name, phone, address });

    // Get the MongoDB client from better-auth
    const database = auth.db;

    if (!database) {
      console.error("Database connection failed");
      return res.status(500).json({ message: "Database connection failed" });
    }

    // Validate that at least one field is provided for update
    if (!name && !phone && !address) {
      return res.status(400).json({
        message: "At least one field (name, phone, address) must be provided",
      });
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Update the user in the database
    const usersCollection = database.collection("user");

    // Better-auth uses 'id' as the primary key, stored as string
    const result = await usersCollection.updateOne(
      { id: userId },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      console.error("User not found with id:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (result.modifiedCount === 0) {
      console.log("No changes made to user profile");
    }

    // Fetch and return the updated user
    const updatedUser = await usersCollection.findOne({ id: userId });

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "Failed to update user profile",
      error: (error as Error).message,
    });
  }
}
