import { Link, useLoaderData } from "react-router";
import { api } from "~/lib/api";
import type { AuctionsResponse, ProductsResponse } from "~/types";
import { formatPrice, formatDateTime, getTimeRemaining } from "~/lib/utils";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { AuctionCard } from "~/components/AuctionCard";

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

export default function Auctions() {
  const { auctions } = useLoaderData<LoaderData>();

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeAuctions.map((auction: any) => (
                <AuctionCard key={auction._id} auction={auction} />
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

        {/* Closed Auctions */}
        {closedAuctions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Closed Auctions ({closedAuctions.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {closedAuctions.map((auction: any) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
