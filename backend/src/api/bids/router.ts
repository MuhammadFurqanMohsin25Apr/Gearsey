import {
  placeBid,
  getBidsByAuction,
  getBidsByUser,
} from "@/controllers/bids/bids-controller.js";
import express from "express";

const router = express.Router();

router.post("/", placeBid);
router.get("/auction/:auctionId", getBidsByAuction);
router.get("/user/:userId", getBidsByUser);

export default router;
