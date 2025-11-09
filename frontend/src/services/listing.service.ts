import apiClient from '@/lib/api-client';
import type {
  Listing,
  ProductsResponse,
  CreateListingFormData,
} from '@/types';

export const listingService = {
  // Get all products with optional filters
  getProducts: async (params?: {
    limit?: number;
    category?: string;
    sellerId?: string;
    query?: string;
  }): Promise<Listing[]> => {
    const response = await apiClient.get<ProductsResponse>('/api/products', {
      params,
    });
    return response.data.products;
  },

  // Get a single product by ID
  getProduct: async (productId: string): Promise<Listing> => {
    const response = await apiClient.get<ProductsResponse>(
      `/api/products?productId=${productId}`
    );
    return response.data.products[0];
  },

  // Create a new product listing
  createProduct: async (data: CreateListingFormData): Promise<Listing> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('condition', data.condition);
    formData.append('is_auction', data.is_auction.toString());

    // Get sellerId from auth context - will be handled by caller
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      formData.append('sellerId', user.id);
    }

    // Append images
    data.images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await apiClient.post<{ message: string; product: Listing }>(
      '/api/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.product;
  },

  // Update an existing product
  updateProduct: async (
    productId: string,
    data: Partial<CreateListingFormData>
  ): Promise<Listing> => {
    const formData = new FormData();
    formData.append('productId', productId);

    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.condition) formData.append('condition', data.condition);
    if (data.is_auction !== undefined)
      formData.append('is_auction', data.is_auction.toString());

    // Append new images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.put<{
      message: string;
      updatedProduct: Listing;
    }>('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.updatedProduct;
  },

  // Delete a product
  deleteProduct: async (productId: string): Promise<void> => {
    await apiClient.delete('/api/products', {
      data: { productId },
    });
  },

  // Get image URL
  getImageUrl: (filename: string): string => {
    return `${apiClient.defaults.baseURL}/api/products/images/${filename}`;
  },
};
