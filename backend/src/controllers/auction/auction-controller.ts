import { Auction, type IAuction } from "@/models/auction.js";
import { type Request, type Response } from "express";

export async function getAuctions(req: Request, res: Response) {
  try {
    const { limit, start_time, end_time } = req.query;
    let formattedStartTime: Date | undefined;
    let formattedEndTime: Date | undefined;
    if (start_time) {
      formattedStartTime = new Date(start_time as string);
    }

    if (end_time) {
      formattedEndTime = new Date(end_time as string);
    }

    const auctions: IAuction[] = await Auction.find({
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    }).limit(limit ? Number(limit) : 10);
    res
      .status(200)
      .json({ auctions, message: "Auctions fetched successfully." });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(400).json({ message: "Failed to fetch auctions." });
  }
}

export async function updateAuction(req: Request, res: Response) {}

export async function deleteAuction(req: Request, res: Response) {}

export async function closeAuction(req: Request, res: Response) {
  try {
    const { auctionId } = req.body;

    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        status: "Closed",
      },
      { new: true }
    );

    if (!updatedAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res
      .status(200)
      .json({ updatedAuction, message: "Auction closed successfully" });
  } catch (error) {
    console.error("Error closing auction:", error);
    res.status(400).json({
      message: "Failed to close the auction. Auction is still going on.",
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
      },
      { new: true }
    );
    if (!updatedAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    res
      .status(200)
      .json({ updatedAuction, message: "Auction cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling auction:", error);
    res.status(400).json({ message: "Failed to cancel the auction." });
  }
}
