import express from 'express';
import { getDrivers } from '../services/driversService';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const drivers = getDrivers();
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

export default router;
