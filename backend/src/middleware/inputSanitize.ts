import { Request, Response, NextFunction } from "express";

const EVENT_PATTERN = /(\s+on\w+\s*=\s*["'][^"']*["'])/gi;
const JS_PROTOCOL = /javascript\s*:/gi;
const MONGO_OPS = /^\$/;

const sanitize = (value: any): any => {
  if (typeof value === "string") {
    return value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .replace(EVENT_PATTERN, "")
      .replace(JS_PROTOCOL, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === "object") {
    const result: any = {};

    for (const key in value) {
      if (MONGO_OPS.test(key)) continue;
      result[key] = sanitize(value[key]);
    }

    return result;
  }

  return value;
};

const deepSanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      if (MONGO_OPS.test(key)) continue;
      result[key] = deepSanitizeObject(obj[key]);
    }
    return result;
  }

  if (typeof obj === "string") {
    return obj
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .replace(EVENT_PATTERN, "")
      .replace(JS_PROTOCOL, "");
  }

  return obj;
};

export const inputSanitize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body = deepSanitizeObject(req.body);
  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitizeObject(req.query) as any;
  }
  if (req.params && typeof req.params === 'object') {
    req.params = deepSanitizeObject(req.params) as any;
  }
  next();
};
