import {
  placeBid,
  getBidsByAuction,
  getBidsByUser,
  getUserBidCountByAuction,
} from "@/controllers/bids/bids-controller.js";
import express from "express";

const router = express.Router();

router.post("/", placeBid);
router.get("/auction/:auctionId", getBidsByAuction);
router.get("/user/:userId", getBidsByUser);
router.get("/auction/:auctionId/user/:userId/count", getUserBidCountByAuction);

export default router;
