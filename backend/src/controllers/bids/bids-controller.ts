import { Bid, type IBid } from "@/models/bid.js";
import { Auction, type IAuction } from "@/models/auction.js";
import { Listing } from "@/models/listing.js";
import "@/models/user.js"; // Ensure User model is registered
import { type Request, type Response } from "express";

export async function placeBid(req: Request, res: Response) {
  try {
    const { auctionId, userId, bid_amount } = req.body;

    // Validate required fields
    if (!auctionId || !userId || !bid_amount) {
      return res.status(400).json({
        message: "Missing required fields: auctionId, userId, bid_amount",
      });
    }

    // Validate bid amount is a positive number
    if (typeof bid_amount !== "number" || bid_amount <= 0) {
      return res.status(400).json({
        message: "Bid amount must be a positive number",
      });
    }

    // Fetch the auction
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Check if user is the seller - seller cannot bid on their own auction
    if (auction.sellerId === userId) {
      return res.status(403).json({
        message: "Seller cannot bid on their own auction",
      });
    }

    // Check if auction is still active
    if (auction.status !== "Active") {
      return res.status(400).json({
        message: "This auction is no longer active",
      });
    }

    // Check if auction has ended
    const now = new Date();
    if (now > auction.end_time) {
      return res.status(400).json({
        message: "This auction has ended",
      });
    }

    // Validate that bid amount is greater than current price
    if (bid_amount <= auction.current_price) {
      return res.status(400).json({
        message: `Bid amount must be greater than the current bid of PKR ${auction.current_price}`,
      });
    }

    // Create the bid - allow multiple bids from same user
    const bid: IBid = await Bid.create({
      auctionId,
      userId,
      bid_amount,
    });

    // Update the auction with the new current price and bidder
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        current_price: bid_amount,
        winnerId: userId,
        totalBids: (auction.totalBids || 0) + 1,
      },
      { new: true }
    );

    res.status(201).json({
      bid,
      updatedAuction,
      message: "Bid placed successfully",
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Failed to place bid" });
  }
}

export async function getBidsByAuction(req: Request, res: Response) {
  try {
    const { auctionId } = req.params;

    const bids: IBid[] = await Bid.find({ auctionId })
      .sort({
        createdAt: -1,
      })
      .populate("userId", "name image");

    res.status(200).json({ bids, message: "Bids fetched successfully" });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(400).json({ message: "Failed to fetch bids" });
  }
}

export async function getBidsByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const bids: IBid[] = await Bid.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ bids, message: "Bids fetched successfully" });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(400).json({ message: "Failed to fetch bids" });
  }
}

export async function getUserBidCountByAuction(req: Request, res: Response) {
  try {
    const { auctionId, userId } = req.params;

    const bidCount = await Bid.countDocuments({ auctionId, userId });

    res.status(200).json({
      bidCount,
      message: "Bid count fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching bid count:", error);
    res.status(400).json({ message: "Failed to fetch bid count" });
  }
}
