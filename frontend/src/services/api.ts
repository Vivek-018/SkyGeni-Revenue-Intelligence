import { Summary, Drivers, RiskFactors, Recommendation } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getSummary: (): Promise<Summary> => fetchJson('/api/summary'),
  getDrivers: (): Promise<Drivers> => fetchJson('/api/drivers'),
  getRiskFactors: (): Promise<RiskFactors> => fetchJson('/api/risk-factors'),
  getRecommendations: (): Promise<Recommendation[]> => fetchJson('/api/recommendations'),
};
