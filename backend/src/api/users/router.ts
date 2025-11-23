import express from "express";
import {
  getTotalUsersCount,
  getAllBuyers,
  updateUserProfile,
  getSellerStats,
} from "@/controllers/users/users-controller.js";

const router = express.Router();

router.get("/count", getTotalUsersCount);
router.get("/", getAllBuyers);
router.get("/:userId/stats", getSellerStats);
router.put("/:userId", updateUserProfile);

export default router;
