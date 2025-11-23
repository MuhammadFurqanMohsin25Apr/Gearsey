import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Package } from "lucide-react";
import { Link } from "react-router";
import { api } from "../../lib/api";

interface Product {
  id: string;
  name: string;
  seller: string;
  price: number;
  status: string;
  date: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData: any = await api.products
          .getAll({ limit: 5000 })
          .catch(() => ({ products: [] }));

        console.log("Products API Response:", productsData);

        if (
          productsData &&
          productsData.products &&
          Array.isArray(productsData.products)
        ) {
          const formattedProducts = productsData.products
            .map((p: any) => {
              console.log("Product item:", p);
              return {
                id: p._id || p.id,
                name: p.title || p.name || "Unnamed Product",
                seller: p.sellerId || p.seller || "Unknown",
                price: p.price || 0,
                status: "approved",
                date: p.createdAt
                  ? new Date(p.createdAt).toISOString().split("T")[0]
                  : "N/A",
                createdAt: p.createdAt,
              };
            })
            .sort((a: any, b: any) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA; // Descending order (newest first)
            });
          console.log("Formatted Products:", formattedProducts);
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.products.delete(productId);
        setProducts(products.filter((p) => p.id !== productId));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product");
      }
    }
  };
  return (
    <div className="flex-1 p-4 lg:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Product Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all products in the marketplace
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products
                .filter(
                  (p) =>
                    (filterStatus === "all" || p.status === filterStatus) &&
                    (searchQuery === "" ||
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {product.seller}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-bold">
                      PKR {product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          product.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {product.date}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium space-x-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {products.filter(
          (p) =>
            (filterStatus === "all" || p.status === filterStatus) &&
            (searchQuery === "" ||
              p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        ).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
