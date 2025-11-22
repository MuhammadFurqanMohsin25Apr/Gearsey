import { Link, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { api } from "~/lib/api";
import { ProductCard } from "~/components/ProductCard";
import { AuctionCard } from "~/components/AuctionCard";
import { useSession } from "~/lib/auth-client";
import type {
  CategoriesResponse,
  ProductsResponse,
  AuctionsResponse,
} from "~/types";
import {
  Flame,
  Wrench,
  Package,
  Gavel,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  Award,
  BadgeCheck,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gearsey - Pakistan's Premier Vehicle Spare Parts Marketplace" },
    {
      name: "description",
      content:
        "Buy and sell new & used vehicle spare parts in Pakistan. Fixed prices and auctions for vintage parts. Trusted marketplace for dealers and enthusiasts.",
    },
  ];
}

export async function loader() {
  try {
    const [featuredProducts, categories, activeAuctions] = await Promise.all([
      api.products.getAll({
        limit: 8,
        is_auction: false,
      }) as Promise<ProductsResponse>,
      api.categories.getAll(10) as Promise<CategoriesResponse>,
      api.auctions.getAll({
        limit: 4,
        status: "Active",
      }) as Promise<AuctionsResponse>,
    ]);

    return {
      featuredProducts: featuredProducts.products || [],
      categories: categories.categories || [],
      auctions: activeAuctions.auctions || [],
    };
  } catch (error) {
    console.error("Failed to load homepage data:", error);
    return {
      featuredProducts: [],
      categories: [],
      auctions: [],
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featuredProducts, categories, auctions } = loaderData;
  const [hasAnimated, setHasAnimated] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Set animation flag after component mounts
    setHasAnimated(true);
  }, []);

  // Mock data for enhanced UI - Replace with actual API calls
  const mockReviews = [
    {
      id: 1,
      userName: "Ahmed Khan",
      userImage: "AK",
      rating: 5,
      comment:
        "Excellent quality brake pads! Installed them last week and the difference is amazing. Highly recommended!",
      productName: "Honda Civic Brake Pads",
      date: "2 days ago",
      verified: true,
    },
    {
      id: 2,
      userName: "Sara Ali",
      userImage: "SA",
      rating: 4,
      comment:
        "Good product, fast delivery. The headlights are bright and fit perfectly.",
      productName: "Toyota Corolla Headlights",
      date: "5 days ago",
      verified: true,
    },
    {
      id: 3,
      userName: "Ali Raza",
      userImage: "AR",
      rating: 5,
      comment: "Perfect engine oil for my Suzuki. Price was great too!",
      productName: "Suzuki Alto Engine Oil",
      date: "1 week ago",
      verified: true,
    },
  ];

  const topSellers = [
    {
      id: 1,
      name: "Auto Parts Pro",
      rating: 4.8,
      totalSales: 1250,
      products: 156,
      responseTime: "< 1 hour",
      verified: true,
    },
    {
      id: 2,
      name: "Quality Parts Hub",
      rating: 4.9,
      totalSales: 980,
      products: 98,
      responseTime: "< 2 hours",
      verified: true,
    },
    {
      id: 3,
      name: "Spare Parts Center",
      rating: 4.7,
      totalSales: 756,
      products: 124,
      responseTime: "< 3 hours",
      verified: true,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Automotive Style */}
      <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white overflow-hidden min-h-[400px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/gears-bg.jpg"
            alt="Gears Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Flash Sale Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full mb-4 animate-pulse">
              <Flame className="w-4 h-4" /> MODERN AUTO WHEEL - UP TO 60% OFF!
            </div>

            {/* Main Heading - Slide in from top */}
            <h1
              className={`text-4xl md:text-5xl font-black mb-4 leading-tight text-white ${hasAnimated ? "animate-slide-down" : "opacity-0"}`}
            >
              Original Equipment
              <span className="block text-red-600 mt-2">Manufacturer</span>
            </h1>

            {/* Description - Fade in */}
            <p
              className={`text-lg text-gray-200 mb-6 max-w-2xl mx-auto ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              Premium quality auto parts for all vehicle models. Guaranteed
              authenticity and best prices in Pakistan.
            </p>

            {/* CTA Button - Slide in from bottom */}
            <Link
              to="/products"
              className={`inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-lg shadow-2xl hover:shadow-red-600/50 transition-all duration-300 ${hasAnimated ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: "0.5s" }}
            >
              SHOP NOW →
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Flame className="w-10 h-10" />
              <div>
                <h3 className="text-2xl font-black">Attention! Flash Sales</h3>
                <p className="text-red-100">
                  Get the latest news & amazing offers
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { label: "DAYS", value: "02" },
                { label: "HOURS", value: "10" },
                { label: "MINS", value: "24" },
                { label: "SECS", value: "05" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center border border-white/30"
                >
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="text-xs font-semibold opacity-90">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* Brand Trust Section */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <h4 className="text-3xl font-black text-gray-900 mb-1">1000+</h4>
              <p className="text-gray-600 font-medium">Products</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-gray-900 mb-1">500+</h4>
              <p className="text-gray-600 font-medium">Brands We Trust</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-red-600 mb-1">24/7</h4>
              <p className="text-gray-600 font-medium">Support</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-gray-900 mb-1">10k+</h4>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2
            className={`text-4xl font-black text-center mb-4 text-gray-900 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
          >
            Why Choose Gearsey?
          </h2>
          <p
            className={`text-center text-gray-600 mb-16 max-w-2xl mx-auto ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            Your trusted partner for authentic auto parts with unbeatable
            service
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 ${hasAnimated ? "animate-slide-right" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">
                100% Genuine
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All products are authentic OEM and verified by our quality
                assurance team
              </p>
            </div>

            <div
              className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 ${hasAnimated ? "animate-scale-in" : "opacity-0"}`}
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">
                Best Prices
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Competitive pricing with multiple sellers ensuring great deals
                every day
              </p>
            </div>

            <div
              className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 ${hasAnimated ? "animate-slide-left" : "opacity-0"}`}
              style={{ animationDelay: "0.7s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">
                Fast Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quick delivery across Pakistan with real-time tracking and
                support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center mb-12 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
          >
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Weekly Top Categories
              </h2>
              <p className="text-gray-600">
                Explore our most popular product categories
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className={`flex justify-start item-start gap-2 bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-red-300 ${hasAnimated ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center mb-12 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
          >
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Best Selling Products
              </h2>
              <p className="text-gray-600">
                Top-rated auto parts loved by our customers
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              View All
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={hasAnimated ? "animate-scale-in" : "opacity-0"}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                No products available at the moment.
              </p>
              <Link
                to="/manage-products"
                className="inline-block mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
              >
                Be the first to sell
              </Link>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              View All Products
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section - For Buyers */}
      {user?.role === "buyer" && (
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-12 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                Customer Reviews
              </h2>
              <p className="text-gray-600">
                See what our customers are saying about our products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockReviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 ${hasAnimated ? "animate-slide-up" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
                      {review.userImage}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">
                          {review.userName}
                        </h4>
                        {review.verified && (
                          <BadgeCheck className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {review.comment}
                  </p>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Product:</span>{" "}
                      {review.productName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Sellers Section - For Buyers */}
      {user?.role === "buyer" && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-12 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <Award className="w-10 h-10 text-red-600" />
                Top Rated Sellers
              </h2>
              <p className="text-gray-600">
                Shop from verified sellers with excellent ratings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topSellers.map((seller, index) => (
                <div
                  key={seller.id}
                  className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-300 ${hasAnimated ? "animate-scale-in" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                        {seller.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-900">
                            {seller.name}
                          </h3>
                          {seller.verified && (
                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {seller.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({seller.totalSales} sales)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Products
                      </span>
                      <span className="font-bold text-gray-900">
                        {seller.products}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Total Sales
                      </span>
                      <span className="font-bold text-gray-900">
                        {seller.totalSales}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Response Time
                      </span>
                      <span className="font-bold text-green-600">
                        {seller.responseTime}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/products?seller=${encodeURIComponent(seller.name)}`}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    View Products
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Auctions */}
      {auctions.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`flex justify-between items-center mb-12 ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
            >
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                  <Flame className="w-10 h-10 text-red-600" /> Live Auctions
                </h2>
                <p className="text-gray-600">
                  Bid on exclusive vintage and rare parts
                </p>
              </div>
              <Link
                to="/auctions"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                All Auctions
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {auctions.slice(0, 3).map((auction, index) => (
                <div
                  key={auction._id}
                  className={hasAnimated ? "animate-scale-in" : "opacity-0"}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AuctionCard auction={auction as any} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
              Get The Latest News &
              <span className="block">Amazing Offers!</span>
            </h2>
            <p className="text-base mb-5 text-red-100">
              Subscribe to our newsletter and never miss exclusive deals on
              premium auto parts
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-5">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-lg bg-transparent border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-base"
              />
              <button className="px-8 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-lg shadow-2xl transform transition-all duration-300 text-base">
                SUBMIT
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-red-600 font-black rounded-lg shadow-2xl hover:shadow-white/30 transform transition-all duration-300 text-base text-center"
              >
                Create Account
              </Link>
              <Link
                to="/products"
                className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-black rounded-lg shadow-2xl transform transition-all duration-300 text-base text-center"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
