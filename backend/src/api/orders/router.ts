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
  getSalesByCategory,
  getSellerStats,
} from "@/controllers/order/order-controller.js";

const router = express.Router();

router.get("/top-products", getTopProductsByOrders);
router.get("/sales-by-category", getSalesByCategory);
router.get("/seller-stats/:sellerId", getSellerStats);
router.get("/", getAllOrders);
router.get("/:userId", getUserOrders);
router.get("/:userId/:orderId", getUserOrderItems);
router.post("/", createOrder);
router.delete("/", deleteOrder);
router.put("/confirm", confirmOrder);
router.put("/cancel", cancelOrder);
router.put("/", updateOrder);

export default router;
