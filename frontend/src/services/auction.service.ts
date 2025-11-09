import apiClient from '@/lib/api-client';
import type { Auction, AuctionsResponse } from '@/types';

export const auctionService = {
  // Get all auctions with optional filters
  getAuctions: async (params?: {
    status?: 'Active' | 'Closed' | 'Cancelled';
    limit?: number;
  }): Promise<Auction[]> => {
    const response = await apiClient.get<AuctionsResponse>('/api/auction', {
      params,
    });
    return response.data.auctions;
  },

  // Update an auction
  updateAuction: async (
    auctionId: string,
    data: Partial<Auction>
  ): Promise<Auction> => {
    const response = await apiClient.put<{
      message: string;
      updatedAuction: Auction;
    }>('/api/auction', {
      auctionId,
      ...data,
    });
    return response.data.updatedAuction;
  },

  // Close an auction
  closeAuction: async (auctionId: string): Promise<Auction> => {
    const response = await apiClient.put<{
      message: string;
      auction: Auction;
    }>('/api/auction/close', {
      auctionId,
    });
    return response.data.auction;
  },

  // Cancel an auction
  cancelAuction: async (auctionId: string): Promise<Auction> => {
    const response = await apiClient.put<{
      message: string;
      auction: Auction;
    }>('/api/auction/cancel', {
      auctionId,
    });
    return response.data.auction;
  },

  // Delete an auction
  deleteAuction: async (auctionId: string): Promise<void> => {
    await apiClient.delete('/api/auction', {
      data: { auctionId },
    });
  },
};
