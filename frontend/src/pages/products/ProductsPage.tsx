import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { listingService } from '@/services/listing.service';
import { categoryService } from '@/services/category.service';
import { useCartStore } from '@/store/cart.store';
import type { Listing, Category } from '@/types';
import { ShoppingCart, Search, Filter, Package } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        listingService.getProducts({
          category: selectedCategory || undefined,
          query: searchQuery || undefined,
          limit: 50,
        }),
        categoryService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Listing) => {
    addItem(product);
  };

  if (loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-4xl font-bold text-transparent">
            Browse Products
          </h1>
          <p className="text-lg text-gray-600">Discover quality automotive parts and accessories</p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full md:w-64"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-lg">
            <Package className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product._id} hover className="group overflow-hidden transition-all duration-300 hover:scale-105">
                <Link to={`/products/${product._id}`} className="block">
                  {product.imageIds && product.imageIds.length > 0 ? (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={listingService.getImageUrl(product.imageIds[0].fileName)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {product.is_auction && (
                        <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          🔥 Auction
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-gray-900 group-hover:text-primary-600">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-2xl font-bold text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="rounded-full bg-gradient-to-r from-secondary-50 to-accent-50 px-3 py-1 text-xs font-semibold text-secondary-700">
                        {product.condition}
                      </span>
                    </div>
                    {!product.is_auction && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Product Count */}
        {products.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-primary-600">{products.length}</span> products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
