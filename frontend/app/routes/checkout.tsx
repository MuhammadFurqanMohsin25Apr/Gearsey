import { Link, useNavigate, useLocation } from "react-router";
import { formatPrice } from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import { api } from "~/lib/api";
import type { CartItem } from "~/lib/cart";

export function meta() {
  return [
    { title: "Checkout - Gearsey" },
    { name: "description", content: "Complete your order" },
  ];
}

export default function Checkout() {
  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auctionData, setAuctionData] = useState<any>(null);

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

  // Card details form data
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    // Check if auction data is passed via location state
    const state = location?.state as any;
    if (state?.auctionData) {
      setAuctionData(state.auctionData);
    } else {
      const cart = cartManager.getCart();
      setCartItems(cart);
    }

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
  }, [user, location]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!auctionData && cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let orderResponse;

      if (auctionData) {
        // Handle auction order - create order with auction details
        orderResponse = await api.orders.create({
          userId: user.id,
          items: [],
          total_amount: orderTotal,
          isAuction: true,
          auctionId: auctionData.auctionId,
        });
      } else {
        // Format items for regular order
        const orderItems = cartItems.map((item) => ({
          partId: item.id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        // Create regular order
        orderResponse = await api.orders.create({
          userId: user.id,
          items: orderItems,
          total_amount: orderTotal,
        });
      }

      // Create payment record
      if (orderResponse && (orderResponse as any).order) {
        const order = (orderResponse as any).order;

        try {
          await api.payments.create({
            orderId: order._id,
            payment_method:
              paymentMethod === "credit_card"
                ? "Credit Card"
                : paymentMethod === "debit_card"
                  ? "Debit Card"
                  : paymentMethod,
            amount: orderTotal,
          });
        } catch (paymentError) {
          console.error("Payment creation error:", paymentError);
          // Continue even if payment fails - order is created
        }

        // Clear cart after successful order (only for regular orders)
        if (!auctionData) {
          cartManager.clearCart();
        }

        // Redirect to orders page
        alert(
          auctionData
            ? "Auction payment processed successfully!"
            : "Order placed successfully!"
        );
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
  const subtotal = auctionData
    ? auctionData.amount
    : cartManager.getTotal(cartItems);
  const shipping = 0; // Free shipping
  const orderTotal = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
          Checkout
        </h1>

        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-600 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg sm:rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <select
                        name="province"
                        value={shippingData.province}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg sm:rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Payment Method
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2 sm:mr-3"
                    />
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-medium text-sm sm:text-base text-gray-900">
                        Credit Card
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                        Visa, Mastercard
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="debit_card"
                      checked={paymentMethod === "debit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className=" mr-2 sm:mr-3"
                    />
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-medium text-sm sm:text-base text-gray-900">
                        Debit Card
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                        Visa, Mastercard
                      </span>
                    </div>
                  </label>
                </div>

                {/* Card Details Form */}
                {(paymentMethod === "credit_card" ||
                  paymentMethod === "debit_card") && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {paymentMethod === "credit_card"
                        ? "Credit Card Details"
                        : "Debit Card Details"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {paymentMethod === "credit_card"
                            ? "Credit Card Holder Name"
                            : "Debit Card Holder Name"}
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardDetails.cardholderName}
                          onChange={handleCardDetailsChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {paymentMethod === "credit_card"
                            ? "Credit Card Number"
                            : "Debit Card Number"}
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailsChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            placeholder="123"
                            maxLength="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                {auctionData ? (
                  <div className="mb-6 space-y-3 pb-6 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      {auctionData.productImage && (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={api.products.getImage(
                              auctionData.productImage
                            )}
                            alt={auctionData.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start text-sm text-gray-700">
                          <div>
                            <span className="font-semibold">
                              {auctionData.productName}
                            </span>
                            <span className="block text-xs text-purple-600 mt-1">
                              Auction Win
                            </span>
                          </div>
                          <span className="font-medium">
                            PKR{" "}
                            {Number(auctionData.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : cartItems.length === 0 ? (
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
                    <span className="font-medium text-green-600">FREE</span>
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
