import express from "express";
import {
  getTotalUsersCount,
  getAllBuyers,
} from "@/controllers/users/users-controller.js";

const router = express.Router();

router.get("/count", getTotalUsersCount);
router.get("/", getAllBuyers);

export default router;
