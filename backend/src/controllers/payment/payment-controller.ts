import { Payment } from "@/models/payment.js";
import { type Request, type Response } from "express";

export async function getPaymentDetails(req: Request, res: Response) {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res
      .status(200)
      .json({ data: payment, message: "Payment details fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { orderId, payment_method, amount } = req.body;
    if (!orderId || !payment_method || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPayment = new Payment({
      orderId,
      payment_method,
      amount,
      status: "Pending",
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      data: savedPayment,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function processPayment(req: Request, res: Response) {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "Completed" },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res
      .status(200)
      .json({ data: payment, message: "Payment processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function refundPayment(req: Request, res: Response) {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "Refunded" },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res
      .status(200)
      .json({ data: payment, message: "Payment refunded successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function listTransactions(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const { userId } = req.body;

    if (limit && isNaN(Number(limit))) {
      return res.status(400).json({ error: "Invalid limit parameter" });
    }

    // Fetch 5 recent transactions for the user
    const transactions = await Payment.find({ userId })
      .sort({ date: -1 })
      .limit(limit ? Number(limit) : 10)
      .select("amount status");

    res.status(200).json({
      data: transactions,
      count: transactions.length,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
