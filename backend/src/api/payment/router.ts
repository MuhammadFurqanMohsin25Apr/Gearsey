import {
  createPayment,
  getPaymentDetails,
  listTransactions,
  processPayment,
  refundPayment,
  getAllPayments,
  getPaymentByOrderId,
} from "@/controllers/payment/payment-controller.js";
import express from "express";

const router = express.Router();

router.get("/details", getAllPayments);
router.get("/details/:paymentId", getPaymentDetails);
router.get("/order/:orderId", getPaymentByOrderId);
router.post("/process", processPayment);
router.post("/create", createPayment);
router.post("/refund", refundPayment);

export default router;
