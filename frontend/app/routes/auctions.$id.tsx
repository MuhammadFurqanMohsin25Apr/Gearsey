import { Form, Link } from "react-router";
import { api } from "~/lib/api";
import type { Auction } from "~/types";
import { formatPrice, formatDateTime, getTimeRemaining } from "~/lib/utils";
import { useState, useEffect } from "react";

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

export default function AuctionDetail({
  loaderData,
}: {
  loaderData: LoaderData;
}) {
  const { auction, product } = loaderData;

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
            href="/auctions"
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

  const isActive =
    auction.status === "Active" && getTimeRemaining(auction.end_time).total > 0;
  const minimumBid = auction.current_price + 100;

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minimumBid) {
      alert(`Minimum bid is ${formatPrice(minimumBid)}`);
      return;
    }
    // TODO: Implement bid placement
    alert(`Bid placed: ${formatPrice(bidAmount)}`);
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

            {/* Auction History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bid History
              </h2>
              <p className="text-gray-600 text-sm">
                Bid history will be displayed here once bidding starts.
              </p>
            </div>
          </div>

          {/* Sidebar - Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    auction.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : auction.status === "Closed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {auction.status}
                </span>
              </div>

              {/* Current Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                <p className="text-4xl font-bold text-gray-900">
                  {formatPrice(auction.current_price)}
                </p>
              </div>

              {/* Starting Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600">Starting Price</p>
                <p className="text-xl font-semibold text-gray-700">
                  {formatPrice(auction.start_price)}
                </p>
              </div>

              {/* Countdown */}
              <div className="mb-6">
                <AuctionCountdown endTime={auction.end_time} />
              </div>

              {/* Bidding Form */}
              {isActive && (
                <form onSubmit={handlePlaceBid} className="mb-6">
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
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold text-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    Minimum bid: {formatPrice(minimumBid)}
                  </p>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-lg"
                  >
                    Place Bid
                  </button>
                </form>
              )}

              {/* Quick Bid Buttons */}
              {isActive && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Quick Bid
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map((increment) => (
                      <button
                        key={increment}
                        onClick={() =>
                          setBidAmount(auction.current_price + increment)
                        }
                        className="px-3 py-2 bg-gray-100 text-gray-900 font-medium rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        +{increment}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Auction Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Starts:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(auction.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ends:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(auction.end_time)}
                  </span>
                </div>
                {auction.winnerId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Winner:</span>
                    <span className="text-gray-900 font-medium font-mono">
                      {auction.winnerId.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </div>

              {/* Not Active Message */}
              {!isActive && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    {auction.status === "Closed"
                      ? "This auction has ended"
                      : "This auction is no longer active"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
