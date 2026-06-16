import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from "./routes/bookingRoutes.js";
import studentRoutes from './routes/studentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import { FRONTEND_URL, PORT } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { rateLimit } from "./middleware/rateLimit.js";
import { inputSanitize } from "./middleware/inputSanitize.js";
// Add namespace so typescript gets req.user
import './types/express.d.ts';

// Connect to MongoDB
connectDB();

const app = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, '../uploads');
const allowedOrigins = new Set([
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

fs.mkdirSync(path.resolve(uploadsDir, 'listings'), { recursive: true });

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(rateLimit);
app.use(inputSanitize);
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/boardings', listingRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/verifications', verificationRoutes);

app.get('/', (req, res) => {
  res.send('2nd Home API is running...');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
