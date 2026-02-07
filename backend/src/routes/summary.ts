import express from 'express';
import { getSummary } from '../services/summaryService';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const summary = getSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export default router;
