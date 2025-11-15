// API configuration and utilities

const API_BASE_URL = "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters if present
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include",
  };

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP error! status: ${response.status}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Return empty success response for network errors instead of throwing
    console.warn(
      `API request failed for ${endpoint}:`,
      error instanceof Error ? error.message : "Unknown error"
    );
    return { products: [], categories: [], auctions: [] } as T;
  }
}

export const api = {
  // Products
  products: {
    getAll: (params?: {
      limit?: number;
      category?: string;
      sellerId?: string;
      query?: string;
    }) => request("/products", { params }),

    create: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },

    update: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },

    delete: (productId: string) =>
      request("/products", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      }),

    getImage: (filename: string) =>
      `${API_BASE_URL}/products/images/${filename}`,
  },

  // Categories
  categories: {
    getAll: (limit?: number) => request("/category", { params: { limit } }),

    create: (data: { name: string; description: string }) =>
      request("/category", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (data: { id: string; name: string; description: string }) =>
      request("/category", {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request("/category", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
  },

  // Auctions
  auctions: {
    getAll: (params?: {
      limit?: number;
      start_time?: string;
      end_time?: string;
    }) => request("/auction", { params }),

    update: (auctionId: string, data: Partial<any>) =>
      request("/auction", {
        method: "PUT",
        body: JSON.stringify({ auctionId, ...data }),
      }),

    close: (auctionId: string) =>
      request("/auction/close", {
        method: "PUT",
        body: JSON.stringify({ auctionId }),
      }),

    cancel: (auctionId: string) =>
      request("/auction/cancel", {
        method: "PUT",
        body: JSON.stringify({ auctionId }),
      }),

    delete: (auctionId: string) =>
      request("/auction", {
        method: "DELETE",
        body: JSON.stringify({ auctionId }),
      }),
  },

  // Orders
  orders: {
    getAll: () => request("/orders"),

    getByUser: (userId: string) => request(`/orders/${userId}`),

    getOrderItems: (userId: string, orderId: string) =>
      request(`/orders/${userId}/${orderId}`),

    create: (data: { userId: string; items: any[]; total_amount: number }) =>
      request("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    confirm: (orderId: string) =>
      request("/orders/confirm", {
        method: "PUT",
        body: JSON.stringify({ orderId }),
      }),

    cancel: (orderId: string) =>
      request("/orders/cancel", {
        method: "PUT",
        body: JSON.stringify({ orderId }),
      }),

    delete: (orderId: string) =>
      request("/orders", {
        method: "DELETE",
        body: JSON.stringify({ orderId }),
      }),
  },

  // Reviews
  reviews: {
    getAll: () => request("/review"),

    getByProduct: (productId: string) => request(`/review/${productId}`),

    getByUser: (userId: string) => request(`/review/user/${userId}`),

    create: (data: {
      userId: string;
      partId: string;
      rating: number;
      comment: string;
    }) =>
      request("/review", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    delete: (reviewId: string) =>
      request(`/review/${reviewId}`, {
        method: "DELETE",
      }),
  },

  // Users
  users: {
    getTotalCount: () => request<{ totalUsers: number }>("/users/count"),
    getAll: () => request<{ buyers: any[] }>("/users"),
  },

  // Health check
  health: () => request("/health"),
};

// Function to fetch user counts by role using Better Auth admin API
export async function fetchUserCountsByRole(): Promise<{
  buyers: number;
  sellers: number;
}> {
  try {
    const { authClient } = await import("./auth-client");

    // Fetch buyers
    const buyersResponse = await authClient.admin.listUsers({
      filterField: "role",
      filterValue: "buyer",
      filterOperator: "eq",
    });

    // Fetch sellers
    const sellersResponse = await authClient.admin.listUsers({
      filterField: "role",
      filterValue: "seller",
      filterOperator: "eq",
    });

    return {
      buyers: buyersResponse.data?.length || 0,
      sellers: sellersResponse.data?.length || 0,
    };
  } catch (error) {
    console.error("Failed to fetch user counts:", error);
    return {
      buyers: 0,
      sellers: 0,
    };
  }
}

export { ApiError, API_BASE_URL };
