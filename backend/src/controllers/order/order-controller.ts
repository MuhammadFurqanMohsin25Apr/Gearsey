import { Order } from "@/models/order.js";
import { OrderItem, type IOrderItem } from "@/models/orderItem.js";
import { type Request, type Response } from "express";

type OrderBody = {
  userId: string;
  total_amount: number;
  items: IOrderItem[];
};

export async function getAllOrders(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const orders = await Order.find().limit(Number(limit) || 10);

    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error as Error);
    res.status(400).json({
      message: "Failed to fetch all orders",
      error: (error as Error).message,
    });
  }
}

export async function getUserOrders(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    if (!userId) {
      return res
        .status(403)
        .json({ message: "Missing userId in request body" });
    }

    const orders = await Order.find({ userId }).limit(Number(limit) || 10);

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error as Error);
    res.status(400).json({
      message: "Failed to fetch orders",
      error: (error as Error).message,
    });
  }
}

export async function getUserOrderItems(req: Request, res: Response) {
  try {
    const { userId, orderId } = req.params;
    if (!userId || !orderId) {
      return res
        .status(403)
        .json({ message: "Missing userId or orderId in request params" });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    const orderItems = await OrderItem.find({ orderId });

    res.status(200).json({
      message: "Order items fetched successfully",
      order,
      items: orderItems,
    });
  } catch (error) {
    console.error("Error fetching order items:", error as Error);
    res.status(400).json({
      message: "Failed to fetch order items",
      error: (error as Error).message,
    });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, total_amount, items }: OrderBody = req.body;

    if (!userId || !total_amount || !items || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields: userId, total_amount, items",
      });
    }

    // Create the order first
    const order = await Order.create({
      userId,
      total_amount,
      payment_status: "Pending",
      delivery_status: "Pending",
    });

    // Add orderId to each item and create them
    const itemsWithOrderId = items.map(item => ({
      ...item,
      orderId: (order._id as any).toString(),
    }));

    const orderItems = await OrderItem.insertMany(itemsWithOrderId);

    res
      .status(201)
      .json({ message: "Order created successfully", order, orderItems });
  } catch (error) {
    console.error("Error creating order:", error as Error);
    res.status(400).json({
      message: "Failed to create order",
      error: (error as Error).message,
    });
  }
}

export async function confirmOrder(req: Request, res: Response) {
  try {
    const { userId, orderId } = req.body;
    if (!userId || !orderId) {
      return res
        .status(403)
        .json({ message: "Missing userId or orderId in request body" });
    }

    const updatedOrder = await Order.updateOne(
      { _id: orderId, userId },
      { $set: { payment_status: "Confirmed", delivery_status: "Processing" } }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or could not be updated" });
    }

    res
      .status(200)
      .json({ message: "Order confirmed successfully", updatedOrder });
  } catch (error) {
    console.error("Error confirming order:", error as Error);
    res.status(400).json({
      message: "Failed to confirm order",
      error: (error as Error).message,
    });
  }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const { userId, orderId } = req.body;
    if (!userId || !orderId) {
      return res
        .status(403)
        .json({ message: "Missing userId or orderId in request body" });
    }
    const updatedOrder = await Order.updateOne(
      { _id: orderId, userId },
      { $set: { payment_status: "Cancelled", delivery_status: "Cancelled" } }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or could not be updated" });
    }
    res
      .status(200)
      .json({ message: "Order cancelled successfully", updatedOrder });
  } catch (error) {
    console.error("Error cancelling order:", error as Error);
    res.status(400).json({
      message: "Failed to cancel order",
      error: (error as Error).message,
    });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { userId, orderId } = req.body;
    if (!orderId) {
      return res
        .status(403)
        .json({ message: "Missing orderId in request body" });
    }
    
    // If userId is provided, delete only that user's order
    // Otherwise allow admin to delete any order by orderId
    const query = userId ? { _id: orderId, userId } : { _id: orderId };
    const deletedOrder = await Order.deleteOne(query);
    
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or could not be deleted" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error as Error);
    res.status(400).json({
      message: "Failed to delete order",
      error: (error as Error).message,
    });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { orderId, payment_status, delivery_status } = req.body;
    if (!orderId) {
      return res
        .status(403)
        .json({ message: "Missing orderId in request body" });
    }

    const updateData: any = {};
    if (payment_status) updateData.payment_status = payment_status;
    if (delivery_status) updateData.delivery_status = delivery_status;

    const updatedOrder = await Order.updateOne(
      { _id: orderId },
      { $set: updateData }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or could not be updated" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error as Error);
    res.status(400).json({
      message: "Failed to update order",
      error: (error as Error).message,
    });
  }
}
