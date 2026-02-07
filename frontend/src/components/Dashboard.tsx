import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import SummaryCard from './SummaryCard';
import DriversCard from './DriversCard';
import RiskFactorsCard from './RiskFactorsCard';
import RecommendationsCard from './RecommendationsCard';
import { api } from '../services/api';
import { Summary, Drivers, RiskFactors, Recommendation } from '../types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [drivers, setDrivers] = useState<Drivers | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactors | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [summaryData, driversData, riskFactorsData, recommendationsData] = await Promise.all([
          api.getSummary(),
          api.getDrivers(),
          api.getRiskFactors(),
          api.getRecommendations(),
        ]);
        
        setSummary(summaryData);
        setDrivers(driversData);
        setRiskFactors(riskFactorsData);
        setRecommendations(recommendationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
          Loading Revenue Intelligence Data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      <Grid item xs={12}>
        {summary && <SummaryCard summary={summary} />}
      </Grid>
      <Grid item xs={12} lg={6}>
        {drivers && <DriversCard drivers={drivers} />}
      </Grid>
      <Grid item xs={12} lg={6}>
        {riskFactors && <RiskFactorsCard riskFactors={riskFactors} />}
      </Grid>
      <Grid item xs={12}>
        {recommendations.length > 0 && (
          <RecommendationsCard recommendations={recommendations} />
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
