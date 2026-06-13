import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const PORT = Number(process.env.PORT || 5001);
export const MONGODB_URI = requiredEnv('MONGODB_URI');
export const JWT_SECRET = requiredEnv('JWT_SECRET');
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';