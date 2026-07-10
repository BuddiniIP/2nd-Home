import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '../config/env.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error('GLOBAL ERROR', err);

  res.status(statusCode).json({
    message: NODE_ENV === 'production' ? 'Server Error' : err?.message || 'Server Error',
  });
};