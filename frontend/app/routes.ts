import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

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

  // Shopping
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),

  // User Dashboard
  route("dashboard", "routes/dashboard.tsx"),
  route("orders", "routes/orders.tsx"),
  route("manage-products", "routes/manage-products.tsx"),
  route("profile", "routes/profile.tsx"),

  // Admin
  route("admin-profile", "routes/admin-profile.tsx"),
  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/dashboard.tsx"),
      route("users", "routes/admin/users.tsx"),
      route("products", "routes/admin/products.tsx"),
      route("orders", "routes/admin/orders.tsx"),
      route("reviews", "routes/admin/reviews.tsx"),
      route("auctions", "routes/admin/auctions.tsx"),
      route("payments", "routes/admin/payments.tsx"),
    ]),
  ]),
  // route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
