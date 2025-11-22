import express from "express";
import {
  createOrder,
  confirmOrder,
  cancelOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
  getUserOrderItems,
  updateOrder,
  getTopProductsByOrders,
} from "@/controllers/order/order-controller.js";

const router = express.Router();

router.get("/top-products", getTopProductsByOrders);
router.get("/", getAllOrders);
router.get("/:userId", getUserOrders);
router.get("/:userId/:orderId", getUserOrderItems);
router.post("/", createOrder);
router.delete("/", deleteOrder);
router.put("/confirm", confirmOrder);
router.put("/cancel", cancelOrder);
router.put("/", updateOrder);

export default router;
