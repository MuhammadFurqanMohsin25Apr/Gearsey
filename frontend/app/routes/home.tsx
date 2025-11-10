import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { api } from "~/lib/api";
import { ProductCard } from "~/components/ProductCard";
import type {
  CategoriesResponse,
  ProductsResponse,
  AuctionsResponse,
} from "~/types";

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
      api.products.getAll({ limit: 8 }) as Promise<ProductsResponse>,
      api.categories.getAll(10) as Promise<CategoriesResponse>,
      api.auctions.getAll({ limit: 4 }) as Promise<AuctionsResponse>,
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

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find Premium Vehicle Parts
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mt-2">
                At Best Prices
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Pakistan's most trusted marketplace for authentic spare parts
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/sell"
                className="px-8 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold rounded-lg border border-white/30 shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
            {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Choose Gearsey?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/50">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Verified Sellers</h3>
              <p className="text-gray-600 leading-relaxed">
                All sellers are verified to ensure authenticity and quality of
                parts
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/50">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Competitive pricing with multiple sellers ensuring great deals
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/50">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick delivery across Pakistan with real-time tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Parts</h2>
            <Link
              to="/products"
              className="text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Auctions */}
      {auctions.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                🔥 Live Auctions
              </h2>
              <Link
                to="/auctions"
                className="text-rose-600 hover:text-rose-700 font-semibold"
              >
                View All Auctions →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.slice(0, 4).map((auction) => (
                <div
                  key={auction._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold rounded-full mb-3 shadow">
                    {auction.status}
                  </span>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Auction #{auction._id.slice(-6)}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      Current:{" "}
                      <span className="font-bold text-gray-900">
                        PKR {auction.current_price}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Starting: PKR {auction.start_price}
                    </p>
                  </div>
                  <Link
                    to={`/auctions/${auction._id}`}
                    className="mt-4 block w-full text-center px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    Place Bid
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers buying and selling vehicle parts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 text-lg text-center"
            >
              Create Account
            </Link>
            <Link
              to="/products"
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 text-lg border-2 border-white/50 text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
