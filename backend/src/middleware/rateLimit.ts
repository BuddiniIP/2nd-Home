import { Request, Response, NextFunction } from "express";

const requests = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Don't count CORS preflight requests
  if (req.method === 'OPTIONS') return next();

  const ip = req.ip || "unknown";
  const now = Date.now();

  const windowMs = 15 * 60 * 1000; // 15 mins
  const maxRequests = 200;

  const current = requests.get(ip);

  if (!current || now > current.resetTime) {
    requests.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });

    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      message: "Too many requests. Try again later.",
    });
  }

  current.count++;
  next();
};