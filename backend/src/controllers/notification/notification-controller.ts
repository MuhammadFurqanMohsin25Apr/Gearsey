import { Notification, type INotification } from "@/models/notification.js";
import { type Request, type Response } from "express";

export async function createNotification(req: Request, res: Response) {
  try {
    const { userId, type, title, message, auctionId, productId } = req.body;

    if (!userId || !type || !title || !message || !auctionId || !productId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      auctionId,
      productId,
      isRead: false,
    });

    res.status(201).json({
      notification,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0, unreadOnly = false } = req.query;

    const filter: any = { userId };
    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .exec();

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      notifications,
      total,
      message: "Notifications fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(400).json({ message: "Failed to fetch notifications" });
  }
}

export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      notification,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(400).json({ message: "Failed to mark notification as read" });
  }
}

export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      updatedCount: result.modifiedCount,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(400).json({
      message: "Failed to mark all notifications as read",
    });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(400).json({ message: "Failed to delete notification" });
  }
}
