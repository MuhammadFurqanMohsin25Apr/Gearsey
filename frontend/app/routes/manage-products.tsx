import { Link, useRevalidator } from "react-router";
import { api } from "~/lib/api";
import { useSession } from "~/lib/auth-client";
import { formatPrice, formatDate, getStatusBadgeColor } from "~/lib/utils";
import type { ProductsResponse, Listing } from "~/types";
import type { Route } from "./+types/manage-products";
import { Package, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { AddProductDialog } from "~/components/AddProductDialog";
import { EditProductDialog } from "~/components/EditProductDialog";

export function meta() {
  return [
    { title: "Manage Products - Gearsey" },
    { name: "description", content: "Manage your product listings" },
  ];
}

export default function ManageProducts() {
  const { data: session } = useSession();
  const user = session?.user;
  const revalidator = useRevalidator();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch seller's products
  useEffect(() => {
    async function fetchSellerProducts() {
      if (user?.id) {
        setIsLoading(true);
        try {
          const response = await api.products.getAll({ sellerId: user.id }) as ProductsResponse;
          setMyListings(response.products || []);
        } catch (error) {
          console.error("Failed to fetch seller products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchSellerProducts();
  }, [user?.id, revalidator.state]);

  // Filter products
  let filteredProducts = myListings.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterStatus !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.status === filterStatus
    );
  }

  if (filterCondition !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.condition === filterCondition
    );
  }

  if (filterType !== "all") {
    if (filterType === "auction") {
      filteredProducts = filteredProducts.filter(
        (product) => product.is_auction
      );
    } else {
      filteredProducts = filteredProducts.filter(
        (product) => !product.is_auction
      );
    }
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
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const activeListings = myListings.filter((l: Listing) => l.status === "Active");
  const soldListings = myListings.filter((l: Listing) => l.status === "Sold");

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Manage Products
              </h1>
              <p className="text-gray-600 text-lg">
                View, edit, and manage all your product listings
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Total Products
                </p>
                <p className="text-4xl font-black text-gray-900">
                  {myListings.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Active Listings
                </p>
                <p className="text-4xl font-black text-gray-900">
                  {activeListings.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse absolute"></span>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Sold Products
                </p>
                <p className="text-4xl font-black text-gray-900">
                  {soldListings.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">
                  Filters:
                </span>
              </div>

              <div className="flex flex-wrap gap-3 flex-1">
                {/* Status Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:border-gray-300 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Condition
                  </label>
                  <select
                    value={filterCondition}
                    onChange={(e) => setFilterCondition(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:border-gray-300 transition-colors"
                  >
                    <option value="all">All Conditions</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:border-gray-300 transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:border-gray-300 transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery ||
                filterStatus !== "all" ||
                filterCondition !== "all" ||
                filterType !== "all" ||
                sortBy !== "newest") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                    setFilterCondition("all");
                    setFilterType("all");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear All
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery ||
              filterStatus !== "all" ||
              filterCondition !== "all" ||
              filterType !== "all") && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-600">
                  Active Filters:
                </span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    Status: {filterStatus}
                    <button
                      onClick={() => setFilterStatus("all")}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterCondition !== "all" && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1">
                    Condition: {filterCondition}
                    <button
                      onClick={() => setFilterCondition("all")}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterType !== "all" && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1">
                    Type: {filterType === "auction" ? "Auction" : "Fixed Price"}
                    <button
                      onClick={() => setFilterType("all")}
                      className="hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  All Products
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading your products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Date Listed
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProducts.map((product: Listing) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm">
                            {product.imageIds?.[0] && (
                              <img
                                src={api.products.getImage(
                                  product.imageIds[0].fileName
                                )}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 mb-1">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="font-semibold">
                                {product.condition}
                              </span>
                              {product.is_auction && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                  Auction
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-black text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusBadgeColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            to={`/products/${product._id}`}
                            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <button
                            className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                            title="Edit Product"
                            onClick={() => {
                              setSelectedProductToEdit(product);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Product"
                            disabled={isDeleting}
                            onClick={async () => {
                              if (
                                confirm(
                                  `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
                                )
                              ) {
                                setIsDeleting(true);
                                try {
                                  await api.products.delete(product._id);
                                  alert("Product deleted successfully!");
                                  revalidator.revalidate();
                                } catch (error) {
                                  console.error("Failed to delete product:", error);
                                  alert("Failed to delete product. Please try again.");
                                } finally {
                                  setIsDeleting(false);
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {searchQuery || filterStatus !== "all"
                    ? "No Products Found"
                    : "No Products Yet"}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start selling by creating your first product listing"}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg"
                  >
                    <Package className="w-5 h-5" />
                    Create First Product
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => {
          revalidator.revalidate();
        }}
      />

      {/* Edit Product Dialog */}
      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedProductToEdit(null);
        }}
        onSuccess={() => {
          revalidator.revalidate();
        }}
        product={selectedProductToEdit}
      />
    </div>
  );
}
