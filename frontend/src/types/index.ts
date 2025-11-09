// User types matching better-auth backend
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields from backend
  role: 'customer' | 'seller' | 'admin';
  address: string;
  phone: string;
  rating: number;
  total_reviews: number;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Image types
export interface Image {
  _id: string;
  fileName: string;
  mime: 'image/jpg' | 'image/png';
  size: number;
  listingId: string;
}

// Listing types
export interface Listing {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageIds: Image[];
  sellerId: string;
  categoryId: Category;
  condition: 'New' | 'Used' | 'Refurbished';
  is_auction: boolean;
  status: 'Active' | 'Sold' | 'Removed';
  createdAt: Date;
  updatedAt: Date;
}

// Auction types
export interface Auction {
  _id: string;
  partId: string;
  start_price: number;
  current_price: number;
  start_time: Date;
  end_time: Date;
  status: 'Active' | 'Closed' | 'Cancelled';
  winnerId?: string;
}

// Bid types
export interface Bid {
  _id: string;
  userId: string;
  auctionId: string;
  amount: number;
  timestamp: Date;
}

// Order types
export interface Order {
  _id: string;
  userId: string;
  total_amount: number;
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  delivery_status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem types
export interface OrderItem {
  _id: string;
  orderId: string;
  partId: string;
  quantity: number;
  price: number;
}

// Payment types
export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  payment_method: string;
  payment_status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  transaction_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review types
export interface Review {
  _id: string;
  userId: string;
  partId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface ReviewsResponse {
  message: string;
  reviews: Review[];
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role?: 'customer' | 'seller';
}

export interface CreateListingFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Used' | 'Refurbished';
  is_auction: boolean;
  images: File[];
}

export interface CreateReviewFormData {
  partId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export interface CreateOrderFormData {
  items: Array<{
    partId: string;
    quantity: number;
    price: number;
  }>;
}

export interface PaymentFormData {
  orderId: string;
  payment_method: string;
}
