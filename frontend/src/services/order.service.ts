import apiClient from '@/lib/api-client';
import type { Order, OrderItem, OrdersResponse, CreateOrderFormData } from '@/types';

export const orderService = {
  // Get all orders (admin only)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<OrdersResponse>('/api/orders');
    return response.data.orders;
  },

  // Get orders for a specific user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await apiClient.get<OrdersResponse>(
      `/api/orders/${userId}`
    );
    return response.data.orders;
  },

  // Get order items for a specific order
  getUserOrderItems: async (
    userId: string,
    orderId: string
  ): Promise<OrderItem[]> => {
    const response = await apiClient.get<{ message: string; items: OrderItem[] }>(
      `/api/orders/${userId}/${orderId}`
    );
    return response.data.items;
  },

  // Create a new order
  createOrder: async (data: CreateOrderFormData): Promise<Order> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await apiClient.post<{ message: string; order: Order }>(
      '/api/orders',
      {
        userId: user.id,
        items: data.items,
      }
    );
    return response.data.order;
  },

  // Confirm an order
  confirmOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put<{
      message: string;
      order: Order;
    }>('/api/orders/confirm', {
      orderId,
    });
    return response.data.order;
  },

  // Cancel an order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put<{
      message: string;
      order: Order;
    }>('/api/orders/cancel', {
      orderId,
    });
    return response.data.order;
  },

  // Delete an order
  deleteOrder: async (orderId: string): Promise<void> => {
    await apiClient.delete('/api/orders', {
      data: { orderId },
    });
  },
};
