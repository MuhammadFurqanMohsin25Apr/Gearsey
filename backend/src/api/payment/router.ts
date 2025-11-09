import {
  createPayment,
  getPaymentDetails,
  listTransactions,
  processPayment,
  refundPayment,
} from "@/controllers/payment/payment-controller.js";
import express from "express";

const router = express.Router();

router.get("/details/:paymentId", getPaymentDetails);
router.get("/details", listTransactions);
router.post("/process", processPayment);
router.post("/create", createPayment);
router.post("/refund", refundPayment);

export default router;
