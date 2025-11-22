import { Auction, type IAuction } from "@/models/auction.js";
import { type Request, type Response } from "express";
import { AuctionService } from "@/lib/auction-service.js";

export async function getAuctions(req: Request, res: Response) {
  try {
    const { limit, start_time, end_time, status } = req.query;
    const query: any = {};

    if (start_time) {
      query.start_time = { $gte: new Date(start_time as string) };
    }

    if (end_time) {
      query.end_time = { $lte: new Date(end_time as string) };
    }

    if (status) {
      query.status = status;
    }

    const auctions = await Auction.find(query)
      .limit(limit ? Number(limit) : 10)
      .sort({ createdAt: -1 })
      .populate({
        path: "partId",
        populate: [
          { path: "categoryId", select: "name description" },
          { path: "imageIds", select: "fileName mime size" },
        ],
      })
      .exec();

    res.status(200).json({
      auctions,
      message: "Auctions fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(400).json({ message: "Failed to fetch auctions." });
  }
}

export async function getAuctionById(req: Request, res: Response) {
  try {
    const { auctionId } = req.params;

    const details = await AuctionService.getAuctionDetails(auctionId);

    res.status(200).json({
      ...details,
      message: "Auction details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching auction:", error);
    res.status(400).json({ message: "Failed to fetch auction details" });
  }
}

export async function updateAuction(req: Request, res: Response) {
  try {
    const { auctionId } = req.params;
    const updates = req.body;

    const updatedAuction = await Auction.findByIdAndUpdate(auctionId, updates, {
      new: true,
    });

    if (!updatedAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({
      updatedAuction,
      message: "Auction updated successfully",
    });
  } catch (error) {
    console.error("Error updating auction:", error);
    res.status(400).json({ message: "Failed to update auction" });
  }
}

export async function deleteAuction(req: Request, res: Response) {
  try {
    const { auctionId } = req.params;

    const deletedAuction = await Auction.findByIdAndDelete(auctionId);

    if (!deletedAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting auction:", error);
    res.status(400).json({ message: "Failed to delete auction" });
  }
}

export async function closeAuction(req: Request, res: Response) {
  try {
    const { auctionId, sellerId } = req.body;

    if (!auctionId || !sellerId) {
      return res.status(400).json({
        message: "Missing required fields: auctionId, sellerId",
      });
    }

    const closedAuction = await AuctionService.closeAuctionBySeller(
      auctionId,
      sellerId
    );

    res.status(200).json({
      closedAuction,
      message: "Auction closed successfully",
    });
  } catch (error) {
    console.error("Error closing auction:", error);
    res.status(400).json({
      message: (error as Error).message || "Failed to close the auction",
    });
  }
}

export async function cancelAuction(req: Request, res: Response) {
  try {
    const { auctionId } = req.body;

    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        status: "Cancelled",
        closedAt: new Date(),
        closedBy: "cancelled",
      },
      { new: true }
    );

    if (!updatedAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({
      updatedAuction,
      message: "Auction cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling auction:", error);
    res.status(400).json({ message: "Failed to cancel the auction" });
  }
}
