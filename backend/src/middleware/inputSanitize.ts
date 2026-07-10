import { Request, Response, NextFunction } from "express";

const sanitize = (value: any): any => {
  if (typeof value === "string") {
    return value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === "object") {
    const result: any = {};

    for (const key in value) {
      result[key] = sanitize(value[key]);
    }

    return result;
  }

  return value;
};

export const inputSanitize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body = sanitize(req.body);
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      (req.query as any)[key] = sanitize((req.query as any)[key]);
    }
  }
  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      (req.params as any)[key] = sanitize((req.params as any)[key]);
    }
  }
  next();
};