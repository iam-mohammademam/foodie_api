import rateLimit from "express-rate-limit";
export const limiter = (windowMinutes, maxRequests) => {
  return rateLimit({
    windowMs: windowMinutes || 10 * 60 * 1000, // Convert minutes to milliseconds
    max: maxRequests || 5, // Set the max number of requests
    message: {
      status: 429,
      error: "Too many requests",
      message: "You have exceeded the request limit. Please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};
