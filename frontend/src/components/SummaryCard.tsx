import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TargetIcon from '@mui/icons-material/GpsFixed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Summary } from '../types';

interface SummaryCardProps {
  summary: Summary;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isPositive = summary.gap >= 0;
  const changeIsPositive = summary.change.value >= 0;

  const metricCards = [
    {
      label: 'Revenue',
      value: formatCurrency(summary.currentQuarterRevenue),
      icon: <AttachMoneyIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      color: 'primary.main',
      bgColor: 'rgba(26, 35, 126, 0.08)',
    },
    {
      label: 'Target',
      value: formatCurrency(summary.target),
      icon: <TargetIcon sx={{ fontSize: 32, color: 'info.main' }} />,
      color: 'info.main',
      bgColor: 'rgba(33, 150, 243, 0.08)',
    },
    {
      label: 'Gap',
      value: `${isPositive ? '+' : ''}${formatCurrency(summary.gap)}`,
      percentage: `${summary.gapPercentage.toFixed(1)}%`,
      icon: isPositive ? (
        <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main' }} />
      ) : (
        <TrendingDownIcon sx={{ fontSize: 32, color: 'error.main' }} />
      ),
      color: isPositive ? 'success.main' : 'error.main',
      bgColor: isPositive ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
    },
    {
      label: `${summary.change.type} Change`,
      value: `${changeIsPositive ? '+' : ''}${formatCurrency(summary.change.value)}`,
      percentage: `${summary.change.percentage.toFixed(1)}%`,
      icon: changeIsPositive ? (
        <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main' }} />
      ) : (
        <TrendingDownIcon sx={{ fontSize: 32, color: 'error.main' }} />
      ),
      color: changeIsPositive ? 'success.main' : 'error.main',
      bgColor: changeIsPositive ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
    },
  ];

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={3}>
          <AssessmentIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Current Quarter Summary
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {metricCards.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  background: metric.bgColor,
                  border: `1px solid ${metric.color}20`,
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: `${metric.bgColor}dd`,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {metric.label}
                  </Typography>
                  {metric.icon}
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: metric.color,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    mb: metric.percentage ? 0.5 : 0,
                    lineHeight: 1.2,
                  }}
                >
                  {metric.value}
                </Typography>
                {metric.percentage && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: metric.color,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {metric.percentage}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
