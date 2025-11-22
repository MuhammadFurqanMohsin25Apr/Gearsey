import { Auction, type IAuction } from "@/models/auction.js";
import { Notification } from "@/models/notification.js";
import { Bid } from "@/models/bid.js";
import { Listing } from "@/models/listing.js";

export class AuctionService {
  /**
   * Closes an auction manually by the seller
   */
  static async closeAuctionBySeller(auctionId: string, sellerId: string) {
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      throw new Error("Auction not found");
    }

    if (auction.sellerId !== sellerId) {
      throw new Error("Only the seller can close the auction");
    }

    if (auction.status !== "Active") {
      throw new Error("Auction is not active");
    }

    // Update auction status
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        status: "Closed",
        closedAt: new Date(),
        closedBy: "seller_closed",
      },
      { new: true }
    );

    // If there's a winner, notify them and set payment deadline
    if (updatedAuction?.winnerId) {
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);

      await Auction.findByIdAndUpdate(auctionId, {
        paymentDeadline,
      });

      // Create notification for winner
      await Notification.create({
        userId: updatedAuction.winnerId,
        type: "auction_won",
        title: "You Won the Auction!",
        message: `You have won the auction! The product has been added to your cart. You must pay within 3 days.`,
        auctionId: auctionId.toString(),
        productId: auction.partId,
        isRead: false,
      });

      // Notify other bidders
      const allBids = await Bid.find({ auctionId, userId: { $ne: updatedAuction.winnerId } }).distinct(
        "userId"
      );

      for (const userId of allBids) {
        await Notification.create({
          userId: userId.toString(),
          type: "auction_ended",
          title: "Auction Ended",
          message: `The auction has ended. You did not win this auction.`,
          auctionId: auctionId.toString(),
          productId: auction.partId,
          isRead: false,
        });
      }
    }

    return updatedAuction;
  }

  /**
   * Closes auction when time expires
   */
  static async closeExpiredAuction(auctionId: string) {
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      throw new Error("Auction not found");
    }

    const now = new Date();

    if (now <= auction.end_time) {
      throw new Error("Auction has not ended yet");
    }

    if (auction.status !== "Active") {
      throw new Error("Auction is not active");
    }

    // Update auction status
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        status: "Closed",
        closedAt: new Date(),
        closedBy: "time_expired",
      },
      { new: true }
    );

    // If there's a winner, notify them and set payment deadline
    if (updatedAuction?.winnerId) {
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);

      await Auction.findByIdAndUpdate(auctionId, {
        paymentDeadline,
      });

      // Create notification for winner
      await Notification.create({
        userId: updatedAuction.winnerId,
        type: "auction_won",
        title: "You Won the Auction!",
        message: `Congratulations! You have won the auction! The product has been added to your cart. You must pay within 3 days.`,
        auctionId: auctionId.toString(),
        productId: auction.partId,
        isRead: false,
      });

      // Notify other bidders
      const allBids = await Bid.find({ auctionId, userId: { $ne: updatedAuction.winnerId } }).distinct(
        "userId"
      );

      for (const userId of allBids) {
        await Notification.create({
          userId: userId.toString(),
          type: "auction_ended",
          title: "Auction Ended",
          message: `The auction has ended. You did not win this auction.`,
          auctionId: auctionId.toString(),
          productId: auction.partId,
          isRead: false,
        });
      }
    }

    return updatedAuction;
  }

  /**
   * Get auction details with related information
   */
  static async getAuctionDetails(auctionId: string) {
    const auction = await Auction.findById(auctionId).lean();

    if (!auction) {
      throw new Error("Auction not found");
    }

    // Get listing details
    const listing = await Listing.findById(auction.partId).lean();

    // Get bid count
    const bidCount = await Bid.countDocuments({ auctionId });

    // Get highest bidders (top 5)
    const topBids = await Bid.find({ auctionId })
      .sort({ bid_amount: -1 })
      .limit(5)
      .lean();

    return {
      auction,
      listing,
      bidCount,
      topBids,
    };
  }

  /**
   * Check if auction is expired and close if needed
   */
  static async checkAndCloseExpiredAuctions() {
    const now = new Date();

    const expiredAuctions = await Auction.find({
      status: "Active",
      end_time: { $lte: now },
    });

    for (const auction of expiredAuctions) {
      try {
        await this.closeExpiredAuction(auction._id?.toString() || "");
      } catch (error) {
        console.error(`Error closing expired auction ${auction._id}:`, error);
      }
    }

    return expiredAuctions.length;
  }
}
