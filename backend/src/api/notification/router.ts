import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/controllers/notification/notification-controller.js";
import express from "express";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.put("/:notificationId/read", markNotificationAsRead);
router.put("/:userId/read-all", markAllNotificationsAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
