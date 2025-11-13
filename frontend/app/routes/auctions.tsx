import { Link } from "react-router";
import { api } from "~/lib/api";
import type { AuctionsResponse, ProductsResponse } from "~/types";
import { formatPrice, formatDateTime, getTimeRemaining } from "~/lib/utils";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export function meta() {
  return [
    { title: "Live Auctions - Gearsey" },
    {
      name: "description",
      content: "Bid on vintage and rare vehicle spare parts in live auctions",
    },
  ];
}

export async function loader() {
  try {
    const [auctionsData, productsData] = await Promise.all([
      api.auctions.getAll({ limit: 50 }) as Promise<AuctionsResponse>,
      api.products.getAll({ limit: 100 }) as Promise<ProductsResponse>,
    ]);

    // Match auctions with their products
    const auctionsWithProducts = auctionsData.auctions.map((auction) => {
      const product = productsData.products.find(
        (p) => p._id === auction.partId
      );
      return { ...auction, product };
    });

    return { auctions: auctionsWithProducts };
  } catch (error) {
    console.error("Failed to load auctions:", error);
    return { auctions: [] };
  }
}

function AuctionTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) {
    return <span className="text-red-600 font-semibold">Auction Ended</span>;
  }

  return (
    <div className="flex gap-2 text-center">
      <div className="bg-gray-900 text-white px-2 py-1 rounded">
        <div className="text-lg font-bold">{timeLeft.days}</div>
        <div className="text-xs">Days</div>
      </div>
      <div className="bg-gray-900 text-white px-2 py-1 rounded">
        <div className="text-lg font-bold">{timeLeft.hours}</div>
        <div className="text-xs">Hours</div>
      </div>
      <div className="bg-gray-900 text-white px-2 py-1 rounded">
        <div className="text-lg font-bold">{timeLeft.minutes}</div>
        <div className="text-xs">Mins</div>
      </div>
      <div className="bg-gray-900 text-white px-2 py-1 rounded">
        <div className="text-lg font-bold">{timeLeft.seconds}</div>
        <div className="text-xs">Secs</div>
      </div>
    </div>
  );
}

type LoaderData = {
  auctions: any[];
};

export default function Auctions({ loaderData }: { loaderData: LoaderData }) {
  const { auctions } = loaderData;

  const activeAuctions = auctions.filter((a: any) => a.status === "Active");
  const closedAuctions = auctions.filter((a: any) => a.status !== "Active");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Flame className="w-10 h-10 text-red-600" /> Live Auctions
          </h1>
          <p className="text-gray-600">
            Bid on rare and vintage vehicle spare parts
          </p>
        </div>

        {/* Active Auctions */}
        {activeAuctions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Active Auctions ({activeAuctions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAuctions.map((auction: any) => (
                <div
                  key={auction._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  {auction.product && auction.product.imageIds[0] && (
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={api.products.getImage(
                          auction.product.imageIds[0].fileName
                        )}
                        alt={auction.product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                          LIVE
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Product Name */}
                    {auction.product && (
                      <Link
                        to={`/products/${auction.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2 block line-clamp-2"
                      >
                        {auction.product.name}
                      </Link>
                    )}

                    {/* Auction Info */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Bid</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(auction.current_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Starting Bid</p>
                        <p className="text-lg text-gray-700">
                          {formatPrice(auction.start_price)}
                        </p>
                      </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Time Remaining
                      </p>
                      <AuctionTimer endTime={auction.end_time} />
                    </div>

                    {/* Bid Button */}
                    <Link
                      to={`/auctions/${auction._id}`}
                      className="block w-full px-6 py-3 bg-red-600 text-white text-center font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Place Bid
                    </Link>

                    {/* Auction Details */}
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                      <p>Started: {formatDateTime(auction.start_time)}</p>
                      <p>Ends: {formatDateTime(auction.end_time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAuctions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center mb-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Auctions
            </h3>
            <p className="text-gray-600">
              Check back soon for new auction listings
            </p>
          </div>
        )}

        {/* Closed/Ended Auctions */}
        {closedAuctions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ended Auctions ({closedAuctions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedAuctions.map((auction: any) => (
                <div
                  key={auction._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden opacity-75"
                >
                  {/* Product Image */}
                  {auction.product && auction.product.imageIds[0] && (
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={api.products.getImage(
                          auction.product.imageIds[0].fileName
                        )}
                        alt={auction.product.name}
                        className="w-full h-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg">
                          {auction.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Product Name */}
                    {auction.product && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {auction.product.name}
                      </h3>
                    )}

                    {/* Final Price */}
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Final Price</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(auction.current_price)}
                      </p>
                    </div>

                    {/* Winner */}
                    {auction.winnerId && (
                      <p className="text-sm text-gray-600 mb-4">
                        Winner: {auction.winnerId.slice(0, 8)}...
                      </p>
                    )}

                    {/* View Details */}
                    {auction.product && (
                      <Link
                        to={`/products/${auction.product._id}`}
                        className="block w-full px-6 py-3 bg-gray-200 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        View Product
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
