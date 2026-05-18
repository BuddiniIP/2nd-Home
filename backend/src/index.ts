import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import boardingRoutes from './routes/boardings.js';
import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boardings', boardingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('2nd Home API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
