import { Link, useNavigate } from "react-router";
import { formatPrice } from "~/lib/utils";
import { api } from "~/lib/api";
import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import type { CartItem } from "~/lib/cart";

export function meta() {
  return [
    { title: "Shopping Cart - Gearsey" },
    {
      name: "description",
      content: "Review your cart and proceed to checkout",
    },
  ];
}

export default function Cart() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on mount and subscribe to storage changes
  useEffect(() => {
    // Protect cart - only logged in users can access
    if (!session) {
      // Not authenticated - redirect to login
      navigate("/login");
      return;
    }

    // Load cart from storage
    const cart = cartManager.getCart();
    setCartItems(cart);
    setIsLoading(false);

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      const updatedCart = cartManager.getCart();
      setCartItems(updatedCart);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [session, navigate]);

  // If not authenticated or still loading, don't render the page
  if (!session || isLoading) {
    return null;
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = cartManager.updateQuantity(productId, newQuantity);
    setCartItems(updated);
  };

  const removeItem = (productId: string) => {
    const updated = cartManager.removeItem(productId);
    setCartItems(updated);
  };

  const subtotal = cartManager.getTotal(cartItems);
  const shipping = cartItems.length > 0 ? 200 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some parts to get started with your order
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/products/${item.product._id}`}
                      className="shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={
                          item.product.imageIds[0]
                            ? api.products.getImage(
                                item.product.imageIds[0].fileName
                              )
                            : "/placeholder.png"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-1 block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">
                        Condition: {item.product.condition}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full px-6 py-4 bg-blue-600 text-white text-center font-bold rounded-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </Link>

                {/* Payment Methods */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    We Accept:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-800">
                      JazzCash
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-800">
                      Easypaisa
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-800">
                      Credit Card
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-800">
                      Debit Card
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
