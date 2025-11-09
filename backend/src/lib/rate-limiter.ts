import rateLimit from "express-rate-limit";

const RATE_LIMIT_WINDOW_MINUTES = parseInt(
  process.env.RATE_LIMIT_WINDOW_MINUTES as string
);
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS as string
);

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MINUTES * 60 * 1000, // Convert minutes to milliseconds
  limit: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

export default limiter;
