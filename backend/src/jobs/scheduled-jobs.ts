// Scheduled Job Example - Add to your server.ts or create a separate job file

import { AuctionService } from "../lib/auction-service.js";

// Run auction expiration check every minute
setInterval(async () => {
  try {
    console.log("[Auction Job] Checking for expired auctions...");
    const count = await AuctionService.checkAndCloseExpiredAuctions();
    if (count > 0) {
      console.log(`[Auction Job] Closed ${count} expired auctions`);
    }
  } catch (error) {
    console.error("[Auction Job] Error checking expired auctions:", error);
  }
}, 60 * 1000); // Every minute

export {};
