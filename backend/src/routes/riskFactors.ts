import express from 'express';
import { getRiskFactors } from '../services/riskFactorsService';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const riskFactors = getRiskFactors();
    res.json(riskFactors);
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({ error: 'Failed to fetch risk factors' });
  }
});

export default router;
