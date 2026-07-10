import express from 'express';
import cors from 'cors';
import './config/env.js';
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
import paymentRoutes from './routes/paymentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { handleStripeWebhook } from './controllers/paymentController.js';
import { FRONTEND_URL, PORT } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { rateLimit } from "./middleware/rateLimit.js";
import { inputSanitize } from "./middleware/inputSanitize.js";
// Add namespace so typescript gets req.user
import './types/express.d.ts';

// Connect to MongoDB
connectDB();

const app = express();
const allowedOrigins = new Set([
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

// Middleware
// Stripe webhook — must be before global express.json() to get raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

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
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('2nd Home API is running...');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
