import { useSearchParams, Link, useLoaderData } from "react-router";
import { api } from "~/lib/api";
import { ProductCard } from "~/components/ProductCard";
import type {
  ProductsResponse,
  CategoriesResponse,
  Category,
  Listing,
} from "~/types";
import { useState } from "react";
import type { Route } from "./+types/products";
import {
  Filter,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  Sparkles,
  TrendingUp,
  Package,
} from "lucide-react";

export function meta() {
  return [
    { title: "Browse Spare Parts - Gearsey" },
    {
      name: "description",
      content:
        "Browse thousands of vehicle spare parts. Filter by category, condition, and price.",
    },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const query = url.searchParams.get("query") || undefined;
  const limit = 24;

  console.log("[Products Loader] Fetching products...", {
    category,
    query,
    limit,
  });

  try {
    const [productsData, categoriesData] = await Promise.all([
      api.products.getAll({
        limit,
        category,
        query,
      }) as Promise<ProductsResponse>,
      api.categories.getAll() as Promise<CategoriesResponse>,
    ]);

    console.log("[Products Loader] Success:", {
      productsCount: productsData.products?.length || 0,
      categoriesCount: categoriesData.categories?.length || 0,
    });

    return {
      products: productsData.products || [],
      categories: categoriesData.categories || [],
      currentCategory: category,
      searchQuery: query,
      error: null,
    };
  } catch (error) {
    console.error("[Products Loader] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to connect to server";

    return {
      products: [],
      categories: [],
      currentCategory: category,
      searchQuery: query,
      error: errorMessage,
    };
  }
}

type LoaderData = {
  products: Listing[];
  categories: Category[];
  currentCategory?: string;
  searchQuery?: string;
  error: string | null;
};

export default function Products() {
  const { products, categories, currentCategory, searchQuery, error } =
    useLoaderData<typeof clientLoader>();
  useLoaderData<typeof clientLoader>();
  const [searchParams] = useSearchParams();
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter and sort products
  let filteredProducts = [...products];

  // Filter out auction products - only show regular products
  filteredProducts = filteredProducts.filter((p) => !p.is_auction);

  // Filter by condition
  if (selectedCondition !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.condition === selectedCondition
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 flex-wrap">
                {searchQuery ? (
                  <>
                    <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
                    <span className="break-words">Search Results</span>
                  </>
                ) : currentCategory ? (
                  <>
                    <Package className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
                    <span className="break-words">{currentCategory} Parts</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
                    <span className="break-words">Premium Auto Parts</span>
                  </>
                )}
              </h1>
              {searchQuery && (
                <p className="text-base sm:text-xl text-red-100 mb-1.5 sm:mb-2 break-words">
                  Results for "
                  <span className="font-bold text-white">{searchQuery}</span>"
                </p>
              )}
              <p className="text-red-100 text-sm sm:text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Package className="w-10 h-10 sm:w-20 sm:h-20 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-gray-900 flex items-center justify-center gap-2 hover:border-red-500 transition-all shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-black text-gray-900">
                  Filters
                </h2>
              </div>

              {/* Categories */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 sm:h-5 bg-red-600 rounded-full flex-shrink-0"></div>
                  Categories
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li>
                    <Link
                      to="/products"
                      className={`block px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base transition-all ${
                        !currentCategory
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30"
                          : "text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      All Categories
                    </Link>
                  </li>
                  {categories.map((cat: Category) => (
                    <li key={cat._id}>
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className={`block px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base transition-all truncate ${
                          currentCategory === cat.name
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30"
                            : "text-gray-700 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Condition Filter */}
              <div className="mb-4 border-t-2 border-gray-100 pt-4">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 sm:h-5 bg-red-600 rounded-full flex-shrink-0"></div>
                  Condition
                </h3>
                <div className="space-y-0.5">
                  {["all", "New", "Used", "Refurbished"].map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center group cursor-pointer rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={selectedCondition === condition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="scale-50 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                      />
                      <span className="ml-1 text-base text-gray-700 font-semibold group-hover:text-gray-900">
                        {condition === "all" ? "All Conditions" : condition}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-5 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <span className="text-xs sm:text-base text-gray-900 font-bold">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2.5 font-semibold text-xs sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 hover:bg-white transition-all cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {filteredProducts.length >= 24 && (
                  <div className="mt-6 sm:mt-10 text-center">
                    <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-gray-900 mb-2 sm:mb-3">
                    No Products Found
                  </h3>
                  <p className="text-xs sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    We couldn't find any products matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xs sm:text-base rounded-lg sm:rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Browse All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
