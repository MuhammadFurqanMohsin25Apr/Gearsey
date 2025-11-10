import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // Authentication
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  
  // Products
  route("products", "routes/products.tsx"),
  route("products/:id", "routes/products.$id.tsx"),
  
  // Auctions
  route("auctions", "routes/auctions.tsx"),
  route("auctions/:id", "routes/auctions.$id.tsx"),
  
  // Selling
  route("sell", "routes/sell.tsx"),
  
  // Shopping
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
  
  // User Dashboard
  route("dashboard", "routes/dashboard.tsx"),
  route("orders", "routes/orders.tsx"),
  
  // Admin
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
