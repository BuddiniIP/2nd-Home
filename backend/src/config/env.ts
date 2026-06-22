import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = Number(process.env.PORT || 5000);
export const MONGODB_URI = requiredEnv('MONGODB_URI');
export const JWT_SECRET = requiredEnv('JWT_SECRET');
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Email (optional — falls back to Ethereal test account in dev)
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = process.env.EMAIL_PORT || '587';
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';

// Stripe webhook secret (optional — webhook verification skipped if not set)
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';