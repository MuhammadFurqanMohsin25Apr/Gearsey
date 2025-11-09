import slowDown from "express-slow-down";

const SPEED_LIMIT_WINDOW_MS = 1 * 60 * 1000; // 1 minute
const SPEED_LIMIT_REQUESTS_LIMIT = 20; // Max 20 requests per window per IP

const speedLimiter = slowDown({
  windowMs: SPEED_LIMIT_WINDOW_MS,
  delayAfter: SPEED_LIMIT_REQUESTS_LIMIT,
  delayMs: () => 500,
});

export default speedLimiter;
