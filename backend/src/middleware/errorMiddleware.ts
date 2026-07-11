import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '../config/env.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err?.message || 'Server Error';

  if (err?.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {}).map((e: any) => e.message).join(', ');
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  } else if (err?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    message: NODE_ENV === 'production' ? 'Server Error' : message,
  });
};