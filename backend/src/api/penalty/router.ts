import {
  getPenalties,
  getTotalPenalties,
  checkOverduePayments,
  markPenaltyAsPaid,
} from "@/controllers/penalty/penalty-controller.js";
import express from "express";

const router = express.Router();

router.get("/user/:userId", getPenalties);
router.get("/user/:userId/total", getTotalPenalties);
router.post("/check-overdue", checkOverduePayments);
router.put("/:penaltyId/pay", markPenaltyAsPaid);

export default router;
