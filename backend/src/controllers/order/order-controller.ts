import { Order } from "@/models/order.js";
import { OrderItem, type IOrderItem } from "@/models/orderItem.js";
import { Payment } from "@/models/payment.js";
import { Listing } from "@/models/listing.js";
import { type Request, type Response } from "express";

type OrderBody = {
  userId: string;
  total_amount: number;
  items: IOrderItem[];
};

export async function getAllOrders(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const orders = await Order.find()
      .limit(Number(limit) || 0)
      .sort({ createdAt: -1 });

    // Fetch payment info and product name for each order
    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        const payment = await Payment.findOne({
          orderId: (order._id as any).toString(),
        });

        // Fetch first item to get product name
        const item = await OrderItem.findOne({
          orderId: (order._id as any).toString(),
        });
        let productName = "Multiple Products";
        if (item) {
          const listing = await Listing.findById(item.partId);
          if (listing) {
            productName = listing.name;
          }
        }

        return {
          ...order.toObject(),
          payment: payment || null,
          productName,
        };
      })
    );

    res.status(200).json({
      message: "All orders fetched successfully",
      orders: ordersWithPayments,
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

    // Fetch payment info for each order
    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        const payment = await Payment.findOne({
          orderId: (order._id as any).toString(),
        });
        return {
          ...order.toObject(),
          payment: payment || null,
        };
      })
    );

    res.status(200).json({
      message: "Orders fetched successfully",
      orders: ordersWithPayments,
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
    const { userId, total_amount, items, isAuction, auctionId } = req.body;

    // For auction orders, items can be empty
    if (isAuction) {
      if (!userId || !total_amount || !auctionId) {
        return res.status(400).json({
          message:
            "Missing required fields for auction order: userId, total_amount, auctionId",
        });
      }

      // Check if order already exists for this auction
      const existingOrder = await Order.findOne({
        auctionId,
        userId,
      });

      if (existingOrder) {
        // Return existing order instead of creating duplicate
        return res.status(200).json({
          message: "Order already exists for this auction",
          order: existingOrder,
        });
      }

      // Create auction order
      const order = await Order.create({
        userId,
        total_amount,
        delivery_status: "Pending",
        isAuction: true,
        auctionId,
      });

      res
        .status(201)
        .json({ message: "Auction order created successfully", order });
    } else {
      // Regular order validation
      if (!userId || !total_amount || !items || items.length === 0) {
        return res.status(400).json({
          message: "Missing required fields: userId, total_amount, items",
        });
      }

      // Create the order first
      const order = await Order.create({
        userId,
        total_amount,
        delivery_status: "Pending",
      });

      // Add orderId to each item and create them
      const itemsWithOrderId = items.map((item: any) => ({
        ...item,
        orderId: (order._id as any).toString(),
      }));

      const orderItems = await OrderItem.insertMany(itemsWithOrderId);

      res
        .status(201)
        .json({ message: "Order created successfully", order, orderItems });
    }
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
      { $set: { delivery_status: "Processing" } }
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
      { $set: { delivery_status: "Cancelled" } }
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

    // Delete related payment entry
    await Payment.deleteOne({ orderId });

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
    const { orderId, delivery_status } = req.body;
    if (!orderId) {
      return res
        .status(403)
        .json({ message: "Missing orderId in request body" });
    }

    const updateData: any = {};
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

export async function getTopProductsByOrders(req: Request, res: Response) {
  try {
    const { limit = 5 } = req.query;

    // Aggregate order items to find top products by order count
    const topProducts = await OrderItem.aggregate([
      {
        $group: {
          _id: "$partId",
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { orderCount: -1 },
      },
      {
        $limit: Number(limit) || 5,
      },
      {
        $addFields: {
          productIdObj: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "productIdObj",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          orderCount: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          avgPrice: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Top products fetched successfully",
      topProducts,
    });
  } catch (error) {
    console.error("Error fetching top products:", error as Error);
    res.status(400).json({
      message: "Failed to fetch top products",
      error: (error as Error).message,
    });
  }
}

export async function getSalesByCategory(req: Request, res: Response) {
  try {
    const { limit = 3 } = req.query;

    const salesByCategory = await OrderItem.aggregate([
      {
        $addFields: {
          productIdObj: { $toObjectId: "$partId" },
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "productIdObj",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",
          totalSales: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: Number(limit),
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$totalSales",
        },
      },
    ]);

    // Calculate total sales to compute percentage
    const totalSales = salesByCategory.reduce(
      (acc, curr) => acc + curr.value,
      0
    );

    const salesWithPercentage = salesByCategory.map((category) => ({
      ...category,
      percentage:
        totalSales > 0 ? Math.round((category.value / totalSales) * 100) : 0,
    }));

    res.status(200).json({
      message: "Sales by category fetched successfully",
      salesByCategory: salesWithPercentage,
    });
  } catch (error) {
    console.error("Error fetching sales by category:", error as Error);
    res.status(400).json({
      message: "Failed to fetch sales by category",
      error: (error as Error).message,
    });
  }
}

export async function getSellerStats(req: Request, res: Response) {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Get all listings by the seller
    const sellerListings = await Listing.find({ sellerId });
    const listingIds = sellerListings.map((listing) => listing._id.toString());

    if (listingIds.length === 0) {
      return res.status(200).json({
        message: "Seller stats fetched successfully",
        stats: {
          totalRevenue: 0,
          totalOrders: 0,
          totalItemsSold: 0,
        },
      });
    }

    // Get all order items for the seller's products
    const orderItems = await OrderItem.find({
      partId: { $in: listingIds },
    });

    // Get unique order IDs to count total orders
    const uniqueOrderIds = [...new Set(orderItems.map((item) => item.orderId))];

    // Get all orders for these order items to calculate revenue
    const orders = await Order.find({
      _id: { $in: uniqueOrderIds },
    });

    // Get payments to ensure only completed/paid orders are counted
    const orderIdsStr = uniqueOrderIds.map((id) => id.toString());
    const payments = await Payment.find({
      orderId: { $in: orderIdsStr },
      status: { $in: ["Completed", "completed", "Paid", "paid"] },
    });

    const paidOrderIds = payments.map((p) => p.orderId);

    // Calculate revenue from paid orders only
    const totalRevenue = orders
      .filter((order) => paidOrderIds.includes(order._id.toString()))
      .reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate total items sold (quantity) from paid orders
    const totalItemsSold = orderItems
      .filter((item) => paidOrderIds.includes(item.orderId))
      .reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      message: "Seller stats fetched successfully",
      stats: {
        totalRevenue,
        totalOrders: paidOrderIds.length,
        totalItemsSold,
      },
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error as Error);
    res.status(400).json({
      message: "Failed to fetch seller stats",
      error: (error as Error).message,
    });
  }
}

export async function getGrossRevenue(req: Request, res: Response) {
  try {
    // Fetch all order items
    const orderItems = await OrderItem.find();

    // Calculate the sum of all platform_fees from the listings
    let grossRevenue = 0;

    for (const item of orderItems) {
      const listing = await Listing.findById(item.partId);
      if (listing && listing.platform_fee) {
        // Multiply platform fee by quantity of items ordered
        grossRevenue += listing.platform_fee * item.quantity;
      }
    }

    res.status(200).json({
      message: "Gross revenue fetched successfully",
      grossRevenue,
      totalOrders: orderItems.length,
    });
  } catch (error) {
    console.error("Error fetching gross revenue:", error as Error);
    res.status(400).json({
      message: "Failed to fetch gross revenue",
      error: (error as Error).message,
    });
  }
}
