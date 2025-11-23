// Type definitions matching backend models

export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  emailVerified: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Image {
  _id: string;
  fileName: string;
  mime: "image/jpg" | "image/png";
  size: number;
  listingId: string;
}

export interface Listing {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageIds: Image[];
  sellerId: string;
  categoryId: Category;
  condition: "New" | "Used" | "Refurbished";
  is_auction: boolean;
  status: "Active" | "Sold" | "Removed";
  createdAt: string;
  updatedAt: string;
  auction?: {
    _id: string;
    status: "Active" | "Closed" | "Cancelled";
    start_price: number;
    current_price: number;
    start_time: string;
    end_time: string;
    winnerId?: string;
    totalBids: number;
  };
}

export interface Auction {
  _id: string;
  partId: string | Listing;
  start_price: number;
  current_price: number;
  start_time: string;
  end_time: string;
  status: "Active" | "Closed" | "Cancelled";
  winnerId?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  bidCount?: number;
}

export interface Bid {
  _id: string;
  auctionId: string;
  userId: string;
  bid_amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  total_amount: number;
  delivery_status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  payment?: {
    _id: string;
    orderId: string;
    payment_method: "Credit Card" | "Debit Card";
    amount: number;
    status: "Pending" | "Completed" | "Failed" | "Refunded";
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  listingId: string;
  quantity: number;
  price: number;
}

export interface Review {
  _id: string;
  userId: string;
  partId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface ProductsResponse {
  message: string;
  products: Listing[];
}

export interface CategoriesResponse {
  message: string;
  categories: Category[];
}

export interface AuctionsResponse {
  message: string;
  auctions: Auction[];
}

// Cart item for local state
export interface CartItem {
  listing: Listing;
  quantity: number;
}
