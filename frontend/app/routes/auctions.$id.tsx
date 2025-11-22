import { Form, Link, useLoaderData, useNavigate } from "react-router";
import { api } from "~/lib/api";
import type { Auction } from "~/types";
import { formatPrice, formatDateTime, getTimeRemaining } from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth-client";

interface Bid {
  _id: string;
  auctionId: string;
  userId: string | { _id: string; name: string; image?: string };
  bid_amount: number;
  createdAt: string;
}

export function meta() {
  return [
    { title: `Auction Details - Gearsey` },
    { name: "description", content: "Place your bid on this auction" },
  ];
}

export async function loader({ params }: { params: { id: string } }) {
  try {
    const auctionsData = (await api.auctions.getAll({ limit: 100 })) as any;
    const auction = auctionsData.auctions?.find(
      (a: Auction) => a._id === params.id
    );

    if (!auction) {
      return { auction: null, product: null };
    }

    // Get the product details
    const productsData = (await api.products.getAll({ limit: 100 })) as any;
    const product = productsData.products?.find(
      (p: any) => p._id === auction.partId
    );

    return { auction, product };
  } catch (error) {
    console.error("Failed to load auction:", error);
    return { auction: null, product: null };
  }
}

function AuctionCountdown({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) {
    return (
      <div className="bg-red-100 border border-red-400 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-red-800">Auction Ended</h3>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 text-center">Time Remaining</h3>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.days}</div>
          <div className="text-sm opacity-90">Days</div>
        </div>
        <div className="text-4xl font-bold">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm opacity-90">Hours</div>
        </div>
        <div className="text-4xl font-bold">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm opacity-90">Minutes</div>
        </div>
        <div className="text-4xl font-bold">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm opacity-90">Seconds</div>
        </div>
      </div>
    </div>
  );
}

type LoaderData = {
  auction: Auction;
  product: any;
};

export default function AuctionDetail() {
  const { auction, product } = useLoaderData() as LoaderData;

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Auction Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This auction could not be loaded. Please try again later.
          </p>
          <Link
            to="/auctions"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }
  const [bidAmount, setBidAmount] = useState(auction.current_price + 100);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentAuction, setCurrentAuction] = useState(auction);
  const [forceShowForm, setForceShowForm] = useState(false);
  const [isClosingAuction, setIsClosingAuction] = useState(false);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [loadingBidHistory, setLoadingBidHistory] = useState(true);
  const { data: session } = useSession();
  const navigate = useNavigate();

  // Fetch bid history when component mounts or auction changes
  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        setLoadingBidHistory(true);
        const response = (await api.bids.getByAuction(auction._id)) as any;
        if (response.bids && Array.isArray(response.bids)) {
          // Sort bids by newest first
          setBidHistory(
            response.bids.sort(
              (a: Bid, b: Bid) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Failed to load bid history:", error);
      } finally {
        setLoadingBidHistory(false);
      }
    };

    fetchBidHistory();
  }, [auction._id]);

  const minimumBid = currentAuction.current_price + 100;
  const isUserSeller = session?.user?.id === currentAuction.sellerId;
  const isAuctionClosed = currentAuction.status === "Closed";
  const isUserWinner =
    isAuctionClosed &&
    session?.user?.id === currentAuction.winnerId &&
    bidHistory.length > 0;

  // Update bidAmount when auction current_price changes
  useEffect(() => {
    setBidAmount(currentAuction.current_price + 100);
  }, [currentAuction.current_price]);

  // Check auction status and update isActive every second
  useEffect(() => {
    const updateActive = () => {
      const now = new Date();
      const startTime = new Date(currentAuction.start_time);
      const endTime = new Date(currentAuction.end_time);
      const timeRemaining = getTimeRemaining(currentAuction.end_time);

      const active =
        currentAuction.status === "Active" &&
        now >= startTime &&
        now < endTime &&
        timeRemaining.total > 0;

      console.log("Current Time:", now);
      console.log("Auction Start:", startTime);
      console.log("Auction End:", endTime);
      console.log("Auction Status:", currentAuction.status);
      console.log("Time Remaining:", timeRemaining);
      console.log("Is Active:", active);
      setIsActive(active);
    };

    updateActive();
    const interval = setInterval(updateActive, 1000);
    return () => clearInterval(interval);
  }, [currentAuction]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(false);

    // Check if user is logged in
    if (!session?.user) {
      navigate("/login");
      return;
    }

    // Prevent seller from bidding
    if (isUserSeller) {
      setBidError("Seller cannot bid on their own auction");
      return;
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid amount must be at least ${formatPrice(minimumBid)}`);
      return;
    }

    setBidLoading(true);

    try {
      const result = (await api.bids.placeBid({
        auctionId: currentAuction._id,
        userId: session.user.id,
        bid_amount: bidAmount,
      })) as any;

      // Check if result is empty or missing data
      if (!result || !result.updatedAuction) {
        setBidError("Failed to place bid. Please try again.");
        setBidSuccess(false);
        setBidLoading(false);
        return;
      }

      setCurrentAuction(result.updatedAuction);
      setBidSuccess(true);
      setBidError(null);

      // Refresh bid history
      try {
        const response = (await api.bids.getByAuction(
          currentAuction._id
        )) as any;
        if (response.bids && Array.isArray(response.bids)) {
          setBidHistory(
            response.bids.sort(
              (a: Bid, b: Bid) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Failed to refresh bid history:", error);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setBidSuccess(false);
      }, 3000);
    } catch (error: any) {
      let errorMessage = "Failed to place bid";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setBidError(errorMessage);
      setBidSuccess(false);
    } finally {
      setBidLoading(false);
    }
  };

  const handleCloseAuction = async () => {
    if (!isUserSeller) {
      alert("Only the seller can close this auction");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to close this auction? The highest bidder will win."
      )
    ) {
      return;
    }

    setIsClosingAuction(true);

    try {
      const response = await fetch("http://localhost:3000/api/auction/close", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: currentAuction._id,
          sellerId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to close auction");
        return;
      }

      const data = await response.json();
      setCurrentAuction(data.closedAuction);
      alert("Auction closed successfully! Winner has been notified.");
    } catch (error) {
      console.error("Error closing auction:", error);
      alert("Failed to close auction. Please try again.");
    } finally {
      setIsClosingAuction(false);
    }
  };

  const images =
    product?.imageIds?.map((img: any) => api.products.getImage(img.fileName)) ||
    [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/auctions" className="hover:text-blue-600">
            Auctions
          </Link>
          <span>/</span>
          <span className="text-gray-900">
            Auction #{auction._id.slice(-6)}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Images */}
            {product && images.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index
                            ? "border-blue-600"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Product Details */}
            {product && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="prose max-w-none">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Product Details
                  </h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-gray-600">Condition</dt>
                      <dd className="text-base font-medium text-gray-900">
                        {product.condition}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Category</dt>
                      <dd className="text-base font-medium text-gray-900">
                        {typeof product.categoryId === "object"
                          ? product.categoryId.name
                          : "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Product ID</dt>
                      <dd className="text-base font-mono text-gray-900">
                        {product._id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Seller ID</dt>
                      <dd className="text-base font-mono text-gray-900">
                        {product.sellerId}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bid History
              </h2>

              {loadingBidHistory ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading bid history...</p>
                </div>
              ) : bidHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No bids yet. Be the first to bid!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bidHistory.map((bid: Bid, index: number) => (
                    <div
                      key={bid._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-600 text-white font-bold rounded-full text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {typeof bid.userId === "object"
                              ? bid.userId.name
                              : "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatDateTime(bid.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(bid.bid_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    currentAuction.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : currentAuction.status === "Closed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentAuction.status}
                </span>
              </div>

              {/* Current Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                <p className="text-4xl font-bold text-gray-900">
                  {formatPrice(currentAuction.current_price)}
                </p>
              </div>

              {/* Starting Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600">Starting Price</p>
                <p className="text-xl font-semibold text-gray-700">
                  {formatPrice(currentAuction.start_price)}
                </p>
              </div>

              {/* Countdown */}
              <div className="mb-6">
                <AuctionCountdown endTime={currentAuction.end_time} />
              </div>

              {/* Bidding Form */}
              {(isActive || forceShowForm) && (
                <form onSubmit={handlePlaceBid} className="mb-6">
                  {isUserSeller ? (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center mb-4">
                      <p className="text-blue-900 font-bold mb-3">
                        You are the seller
                      </p>
                      <button
                        type="button"
                        onClick={handleCloseAuction}
                        disabled={isClosingAuction || isAuctionClosed}
                        className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg transition-all"
                      >
                        {isClosingAuction
                          ? "Closing Auction..."
                          : "Close Auction"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount
                      </label>
                      <div className="relative mb-2">
                        <span className="absolute left-3 top-3 text-gray-500">
                          PKR
                        </span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          min={minimumBid}
                          step="100"
                          disabled={bidLoading}
                          className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mb-4">
                        Minimum bid: {formatPrice(minimumBid)}
                      </p>

                      {/* Error Message */}
                      {bidError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">{bidError}</p>
                        </div>
                      )}

                      {/* Success Message */}
                      {bidSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            ✓ Bid placed successfully! Refreshing...
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={bidLoading}
                        className="w-full px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {bidLoading ? "Placing Bid..." : "Place Bid"}
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Auction Details */}
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Starts:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(currentAuction.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ends:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(currentAuction.end_time)}
                  </span>
                </div>
              </div>

              {/* Winner Checkout Section */}
              {isUserWinner && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-3">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Congratulations! You Won!
                    </h3>
                    <p className="text-sm text-green-800 mb-1">
                      You are the highest bidder with{" "}
                      <span className="font-bold">
                        {formatPrice(currentAuction.current_price)}
                      </span>
                    </p>
                    <p className="text-xs text-green-700">
                      This item has been added to your orders
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    View My Orders
                  </button>
                </div>
              )}

              {/* Not Active Message */}
              {!isActive && !isUserWinner && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-3">
                    {currentAuction.status === "Closed"
                      ? "This auction has ended"
                      : new Date() < new Date(currentAuction.start_time)
                        ? `Auction starts at ${formatDateTime(currentAuction.start_time)}`
                        : "This auction is no longer active"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setForceShowForm(!forceShowForm)}
                    className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded font-medium text-yellow-900"
                  >
                    {forceShowForm ? "Hide" : "Show"} Bid Form (Debug)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
