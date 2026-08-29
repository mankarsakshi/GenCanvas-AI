import rateLimit from "express-rate-limit";

// Rate limiter for Auth routes (Brute force protection)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP, please try again after 15 minutes.",
  },
});

// Rate limiter for AI image generation (Abuse & DoS protection)
export const generationRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 image generations per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Image generation rate limit exceeded. Please wait a minute before creating new artwork.",
  },
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please slow down.",
  },
});
