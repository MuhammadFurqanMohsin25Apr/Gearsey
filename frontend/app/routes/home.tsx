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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Perfect Spare Part
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Pakistan's trusted marketplace for new and used vehicle spare
              parts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Browse Parts
              </Link>
              <Link
                to="/auctions"
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors text-lg border-2 border-white"
              >
                Live Auctions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Verified Sellers
              </h3>
              <p className="text-gray-600">
                All sellers are verified for your peace of mind
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive prices with auction options
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">Quick shipping across Pakistan</p>
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
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
              className="text-blue-600 hover:text-blue-700 font-semibold"
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
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                🔥 Live Auctions
              </h2>
              <Link
                to="/auctions"
                className="text-red-600 hover:text-red-700 font-semibold"
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
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mb-3">
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
                    className="mt-4 block w-full text-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Parts to Sell?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of sellers and reach buyers across Pakistan
          </p>
          <Link
            to="/sell"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Start Selling Today
          </Link>
        </div>
      </section>
    </div>
  );
}
