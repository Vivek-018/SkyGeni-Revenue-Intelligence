import express from 'express';
import { getRecommendations } from '../services/recommendationsService';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const recommendations = getRecommendations();
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;
