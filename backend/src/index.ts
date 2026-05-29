import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { FRONTEND_URL, PORT } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
// Add namespace so typescript gets req.user
import './types/express.d.ts';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('2nd Home API is running...');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
