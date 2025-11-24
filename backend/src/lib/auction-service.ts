import { Auction, type IAuction } from "@/models/auction.js";
import { Bid } from "@/models/bid.js";
import { Listing } from "@/models/listing.js";
import { Order } from "@/models/order.js";
import { OrderItem } from "@/models/orderItem.js";

export class AuctionService {
  /**
   * Closes an auction manually by the seller or admin
   */
  static async closeAuctionBySeller(
    auctionId: string,
    sellerId: string,
    isAdmin: boolean = false
  ) {
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      throw new Error("Auction not found");
    }

    // Allow admin to close any auction, or seller to close their own
    if (!isAdmin && auction.sellerId !== sellerId) {
      throw new Error("Only the seller or admin can close the auction");
    }

    if (auction.status !== "Active") {
      throw new Error("Auction is not active");
    }

    // Update auction status and end time to current time
    const closedTime = new Date();
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        status: "Closed",
        closedAt: closedTime,
        end_time: closedTime,
        closedBy: isAdmin ? "admin_closed" : "seller_closed",
      },
      { new: true }
    );

    // If there's a winner, set payment deadline
    if (updatedAuction?.winnerId) {
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);

      await Auction.findByIdAndUpdate(auctionId, {
        paymentDeadline,
      });

      // Check if order already exists for this auction
      const existingOrder = await Order.findOne({
        auctionId: auctionId.toString(),
        userId: updatedAuction.winnerId,
      });

      if (existingOrder) {
        console.log(`Order already exists for auction ${auctionId}`);
      } else {
        // Create order for winner
        const order = await Order.create({
          userId: updatedAuction.winnerId,
          total_amount: updatedAuction.current_price,
          delivery_status: "Pending",
          platform_fee: 7,
          isAuction: true,
          auctionId: auctionId.toString(),
        });

        // Create order item
        await OrderItem.create({
          orderId: order._id.toString(),
          partId: auction.partId,
          quantity: 1,
          price: updatedAuction.current_price,
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

    // If there's a winner, set payment deadline
    if (updatedAuction?.winnerId) {
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);

      await Auction.findByIdAndUpdate(auctionId, {
        paymentDeadline,
      });

      // Check if order already exists for this auction
      const existingOrder = await Order.findOne({
        auctionId: auctionId.toString(),
        userId: updatedAuction.winnerId,
      });

      if (existingOrder) {
        console.log(`Order already exists for auction ${auctionId}`);
      } else {
        // Create order for winner
        const order = await Order.create({
          userId: updatedAuction.winnerId,
          total_amount: updatedAuction.current_price,
          delivery_status: "Pending",
          platform_fee: 7,
          isAuction: true,
          auctionId: auctionId.toString(),
        });

        // Create order item
        await OrderItem.create({
          orderId: order._id.toString(),
          partId: auction.partId,
          quantity: 1,
          price: updatedAuction.current_price,
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
