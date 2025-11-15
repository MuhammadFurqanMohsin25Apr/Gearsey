import { Link, useNavigate } from "react-router";
import { formatPrice } from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import { api } from "~/lib/api";
import type { CartItem } from "~/lib/cart";
import type { Route } from "./+types/checkout";
import type { User } from "better-auth";

export function meta() {
  return [
    { title: "Checkout - Gearsey" },
    { name: "description", content: "Complete your order" },
  ];
}

export default function Checkout() {
  const { data: session } = useSession();
  const user : User | undefined = session?.user;
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping form data
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "Punjab",
    postalCode: "",
  });

  useEffect(() => {
    const cart = cartManager.getCart();
    setCartItems(cart);

    // Pre-fill user data if available
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        // Better Auth additional fields
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to place an order");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format items for backend
      const orderItems = cartItems.map((item) => ({
        partId: item.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Create order
      const orderResponse = await api.orders.create({
        userId: user.id,
        items: orderItems,
        total_amount: orderTotal,
      });

      // Create payment record
      if (orderResponse && (orderResponse as any).data?.order) {
        const order = (orderResponse as any).data.order;

        try {
          await api.payments.create({
            orderId: order._id,
            payment_method: paymentMethod,
            amount: orderTotal,
          });
        } catch (paymentError) {
          console.error("Payment creation error:", paymentError);
          // Continue even if payment fails - order is created
        }

        // Clear cart after successful order
        cartManager.clearCart();

        // Redirect to orders page
        alert("Order placed successfully!");
        navigate("/orders");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate order total
  const subtotal = cartManager.getTotal(cartItems);
  const shipping = cartItems.length > 0 ? 200 : 0;
  const orderTotal = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <select
                        name="province"
                        value={shippingData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">Select Province</option>
                        <option>Punjab</option>
                        <option>Sindh</option>
                        <option>KPK</option>
                        <option>Balochistan</option>
                        <option>Gilgit-Baltistan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="jazzcash"
                      checked={paymentMethod === "jazzcash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        JazzCash
                      </span>
                      <span className="text-sm text-gray-600">
                        Mobile Wallet
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="easypaisa"
                      checked={paymentMethod === "easypaisa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Easypaisa
                      </span>
                      <span className="text-sm text-gray-600">
                        Mobile Wallet
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Credit/Debit Card
                      </span>
                      <span className="text-sm text-gray-600">
                        Visa, Mastercard
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                {cartItems.length === 0 ? (
                  <div className="mb-6 text-center text-gray-500 py-8">
                    <p>No items in cart</p>
                  </div>
                ) : (
                  <div className="mb-6 space-y-3 pb-6 border-b border-gray-200">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-6 border-t border-gray-200 pt-6">
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
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || orderTotal === 0}
                  className={`block w-full px-6 py-4 text-white font-bold rounded-lg transition-colors text-center mb-4 ${
                    loading || orderTotal === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Processing..." : "Complete Order"}
                </button>

                <p className="text-xs text-gray-600 text-center">
                  By completing this order, you agree to our{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
