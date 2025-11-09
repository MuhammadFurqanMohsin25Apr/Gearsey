import apiClient from '@/lib/api-client';
import type { Payment, PaymentFormData } from '@/types';

export const paymentService = {
  // Get payment details by payment ID
  getPaymentDetails: async (paymentId: string): Promise<Payment> => {
    const response = await apiClient.get<{ message: string; payment: Payment }>(
      `/api/payment/details/${paymentId}`
    );
    return response.data.payment;
  },

  // List all transactions
  listTransactions: async (params?: {
    userId?: string;
    status?: string;
  }): Promise<Payment[]> => {
    const response = await apiClient.get<{
      message: string;
      transactions: Payment[];
    }>('/api/payment/details', { params });
    return response.data.transactions;
  },

  // Create a new payment
  createPayment: async (data: {
    orderId: string;
    amount: number;
    payment_method: string;
  }): Promise<Payment> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await apiClient.post<{
      message: string;
      payment: Payment;
    }>('/api/payment/create', {
      ...data,
      userId: user.id,
    });
    return response.data.payment;
  },

  // Process a payment
  processPayment: async (data: PaymentFormData): Promise<Payment> => {
    const response = await apiClient.post<{
      message: string;
      payment: Payment;
    }>('/api/payment/process', data);
    return response.data.payment;
  },

  // Refund a payment
  refundPayment: async (paymentId: string): Promise<Payment> => {
    const response = await apiClient.post<{
      message: string;
      payment: Payment;
    }>('/api/payment/refund', {
      paymentId,
    });
    return response.data.payment;
  },
};
