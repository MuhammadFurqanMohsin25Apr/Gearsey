import {
  cancelAuction,
  closeAuction,
  deleteAuction,
  getAuctions,
  updateAuction,
  getAuctionById,
  getUserWonAuctions,
} from "@/controllers/auction/auction-controller.js";
import express from "express";

const router = express.Router();

router.get("/", getAuctions);
router.put("/close", closeAuction);
router.put("/cancel", cancelAuction);
router.get("/won/:userId", getUserWonAuctions);
router.get("/:auctionId", getAuctionById);
router.put("/:auctionId", updateAuction);
router.delete("/:auctionId", deleteAuction);

export default router;
