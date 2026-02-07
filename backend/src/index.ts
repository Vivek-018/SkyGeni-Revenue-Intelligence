import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database';
import summaryRoutes from './routes/summary';
import driversRoutes from './routes/drivers';
import riskFactorsRoutes from './routes/riskFactors';
import recommendationsRoutes from './routes/recommendations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS: allow any origin
app.use(cors({
  origin: true, // reflect request origin (allows any origin, required when credentials: true)
  credentials: true,
}));
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/summary', summaryRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/risk-factors', riskFactorsRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
