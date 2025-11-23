import { Penalty } from "@/models/penalty.js";
import { Order } from "@/models/order.js";
import { Payment } from "@/models/payment.js";

export class PenaltyService {
  /**
   * Check for overdue payments and create penalties
   * An order is considered overdue if payment is pending for more than 24 hours
   */
  static async checkOverduePayments(): Promise<any[]> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find all orders created more than 24 hours ago
      const overdueOrders = await Order.find({
        createdAt: { $lt: oneDayAgo },
      });

      const newPenalties = [];

      for (const order of overdueOrders) {
        // Check if payment exists and is not completed
        const payment = await Payment.findOne({
          orderId: order._id.toString(),
        });

        // Skip if payment is completed or doesn't exist
        if (
          !payment ||
          payment.status === "Completed" ||
          payment.status === "completed"
        ) {
          continue;
        }

        // Check if penalty already exists for this order
        const existingPenalty = await Penalty.findOne({
          orderId: order._id.toString(),
        });

        if (!existingPenalty) {
          // Calculate penalty amount (e.g., 10% of order total)
          const penaltyAmount = order.total_amount * 0.1;

          // Create new penalty
          const penalty = await Penalty.create({
            userId: order.userId,
            orderId: order._id.toString(),
            amount: penaltyAmount,
            reason: "Overdue payment - Payment not completed within 24 hours",
            status: "Pending",
          });

          newPenalties.push(penalty);
        }
      }

      return newPenalties;
    } catch (error) {
      console.error("Error checking overdue payments:", error);
      throw error;
    }
  }

  /**
   * Get all penalties for a user
   */
  static async getUserPenalties(userId: string): Promise<any[]> {
    try {
      const penalties = await Penalty.find({ userId }).sort({ createdAt: -1 });
      return penalties;
    } catch (error) {
      console.error("Error fetching user penalties:", error);
      throw error;
    }
  }

  /**
   * Mark a penalty as paid
   */
  static async markPenaltyAsPaid(penaltyId: string): Promise<any> {
    try {
      const penalty = await Penalty.findByIdAndUpdate(
        penaltyId,
        { status: "Paid", paidAt: new Date() },
        { new: true }
      );

      if (!penalty) {
        throw new Error("Penalty not found");
      }

      return penalty;
    } catch (error) {
      console.error("Error marking penalty as paid:", error);
      throw error;
    }
  }

  /**
   * Waive a penalty (admin action)
   */
  static async waivePenalty(penaltyId: string): Promise<any> {
    try {
      const penalty = await Penalty.findByIdAndUpdate(
        penaltyId,
        { status: "Waived", waivedAt: new Date() },
        { new: true }
      );

      if (!penalty) {
        throw new Error("Penalty not found");
      }

      return penalty;
    } catch (error) {
      console.error("Error waiving penalty:", error);
      throw error;
    }
  }
}
