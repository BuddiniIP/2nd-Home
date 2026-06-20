import { Request, Response, NextFunction } from "express";

const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_REQUESTS = 100;
const CLEANUP_INTERVAL = 60 * 1000; // 1 min

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requests) {
    if (now > entry.resetTime) {
      requests.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

export const rateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "unknown";
  const now = Date.now();

  const current = requests.get(ip);

  if (!current || now > current.resetTime) {
    requests.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });

    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({
      message: "Too many requests. Try again later.",
    });
  }

  current.count++;
  next();
};
