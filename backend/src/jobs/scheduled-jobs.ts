// Scheduled Job Example - Add to your server.ts or create a separate job file
// This runs the penalty check every hour

import { PenaltyService } from "./lib/penalty-service.js";

// Run penalty check every hour (3600000 milliseconds)
setInterval(async () => {
  try {
    console.log("[Penalty Job] Running penalty check...");
    const penalties = await PenaltyService.checkOverduePayments();
    console.log(
      `[Penalty Job] Created ${penalties.length} new penalties for overdue payments`
    );
  } catch (error) {
    console.error("[Penalty Job] Error checking overdue payments:", error);
  }
}, 60 * 60 * 1000); // Every hour

// Optionally run auction expiration check every minute
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

export { };
