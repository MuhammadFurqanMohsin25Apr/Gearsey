import { Penalty, type IPenalty } from "@/models/penalty.js";
import { Auction } from "@/models/auction.js";
import { Notification } from "@/models/notification.js";
import { type Request, type Response } from "express";

export class PenaltyService {
  /**
   * Check for overdue payments and create penalties
   */
  static async checkOverduePayments() {
    const now = new Date();

    // Find all closed auctions with winners where payment deadline has passed
    const overdueAuctions = await Auction.find({
      status: "Closed",
      winnerId: { $ne: null },
      paymentDeadline: { $lte: now },
      closedAt: { $exists: true },
    });

    const createdPenalties: IPenalty[] = [];

    for (const auction of overdueAuctions) {
      // Check if penalty already exists
      const existingPenalty = await Penalty.findOne({
        auctionId: auction._id?.toString(),
        status: "pending",
      });

      if (!existingPenalty) {
        // Create penalty for the winner
        const penalty = await Penalty.create({
          userId: auction.winnerId,
          auctionId: auction._id?.toString(),
          productId: auction.partId,
          amount: auction.current_price, // Penalty amount equals the auction price
          reason: "non_payment_overdue",
          paymentDeadline: auction.paymentDeadline,
        });

        createdPenalties.push(penalty);

        // Create notification
        await Notification.create({
          userId: auction.winnerId,
          type: "payment_overdue",
          title: "Payment Overdue - Penalty Imposed",
          message: `Your payment for the auction was not completed within 3 days. A penalty of PKR ${auction.current_price} has been applied to your account.`,
          auctionId: auction._id?.toString(),
          productId: auction.partId,
          isRead: false,
        });
      }
    }

    return createdPenalties;
  }

  /**
   * Get penalties for a user
   */
  static async getUserPenalties(userId: string) {
    return await Penalty.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get total pending penalties for a user
   */
  static async getTotalPendingPenalties(userId: string) {
    const result = await Penalty.aggregate([
      {
        $match: {
          userId,
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { total: 0, count: 0 };
  }

  /**
   * Mark penalty as paid
   */
  static async markPenaltyAsPaid(penaltyId: string) {
    return await Penalty.findByIdAndUpdate(
      penaltyId,
      { status: "paid" },
      { new: true }
    );
  }

  /**
   * Enforce penalties (deduct from account, restrict bidding, etc.)
   */
  static async enforcePenalty(penaltyId: string) {
    return await Penalty.findByIdAndUpdate(
      penaltyId,
      { status: "enforced" },
      { new: true }
    );
  }
}

export async function getPenalties(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const penalties = await PenaltyService.getUserPenalties(userId);

    res.status(200).json({
      penalties,
      message: "Penalties fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching penalties:", error);
    res.status(400).json({ message: "Failed to fetch penalties" });
  }
}

export async function getTotalPenalties(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const totalPenalties = await PenaltyService.getTotalPendingPenalties(userId);

    res.status(200).json({
      totalPenalties,
      message: "Total penalties calculated successfully",
    });
  } catch (error) {
    console.error("Error calculating total penalties:", error);
    res.status(400).json({ message: "Failed to calculate total penalties" });
  }
}

export async function checkOverduePayments(req: Request, res: Response) {
  try {
    const createdPenalties = await PenaltyService.checkOverduePayments();

    res.status(200).json({
      createdPenalties,
      count: createdPenalties.length,
      message: "Overdue payments checked successfully",
    });
  } catch (error) {
    console.error("Error checking overdue payments:", error);
    res.status(400).json({ message: "Failed to check overdue payments" });
  }
}

export async function markPenaltyAsPaid(req: Request, res: Response) {
  try {
    const { penaltyId } = req.params;

    const penalty = await PenaltyService.markPenaltyAsPaid(penaltyId);

    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    res.status(200).json({
      penalty,
      message: "Penalty marked as paid",
    });
  } catch (error) {
    console.error("Error marking penalty as paid:", error);
    res.status(400).json({ message: "Failed to mark penalty as paid" });
  }
}
