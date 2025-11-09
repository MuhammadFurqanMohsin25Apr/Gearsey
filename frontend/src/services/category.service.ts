import apiClient from '@/lib/api-client';
import type { Category, CategoriesResponse } from '@/types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoriesResponse>('/api/category');
    return response.data.categories;
  },

  // Create a new category
  createCategory: async (data: {
    name: string;
    description?: string;
  }): Promise<Category> => {
    const response = await apiClient.post<{
      message: string;
      category: Category;
    }>('/api/category', data);
    return response.data.category;
  },

  // Update a category
  updateCategory: async (
    categoryId: string,
    data: { name?: string; description?: string }
  ): Promise<Category> => {
    const response = await apiClient.put<{
      message: string;
      updatedCategory: Category;
    }>('/api/category', {
      categoryId,
      ...data,
    });
    return response.data.updatedCategory;
  },

  // Delete a category
  deleteCategory: async (categoryId: string): Promise<void> => {
    await apiClient.delete('/api/category', {
      data: { categoryId },
    });
  },
};
