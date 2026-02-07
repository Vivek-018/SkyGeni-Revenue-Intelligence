import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import WarningIcon from '@mui/icons-material/Warning';
import { RiskFactors } from '../types';

interface RiskFactorsCardProps {
  riskFactors: RiskFactors;
}

const RiskFactorsCard: React.FC<RiskFactorsCardProps> = ({ riskFactors }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" mb={2.5}>
          <WarningIcon sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Risk Factors
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Stale Deals */}
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Stale Deals
              </Typography>
              <Chip
                label={riskFactors.staleDeals.length}
                size="small"
                sx={{
                  bgcolor: 'error.light',
                  color: 'error.dark',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            {riskFactors.staleDeals.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: { xs: 180, sm: 200 },
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: 'none',
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Deal ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Stage
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Days
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskFactors.staleDeals.map((deal) => (
                      <TableRow
                        key={deal.deal_id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {deal.deal_id}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {formatCurrency(deal.amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={deal.stage}
                            size="small"
                            sx={{
                              bgcolor: 'warning.light',
                              color: 'warning.dark',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'error.main' }}>
                          {deal.daysSinceUpdate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                No stale deals found
              </Box>
            )}
          </Box>

          {/* Underperforming Reps */}
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Underperforming Reps
              </Typography>
              <Chip
                label={riskFactors.underperformingReps.length}
                size="small"
                sx={{
                  bgcolor: 'error.light',
                  color: 'error.dark',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            {riskFactors.underperformingReps.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: { xs: 180, sm: 200 },
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: 'none',
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Rep Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Win Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Won
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Lost
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskFactors.underperformingReps.map((rep) => (
                      <TableRow
                        key={rep.rep_id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {rep.name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${rep.winRate.toFixed(1)}%`}
                            size="small"
                            sx={{
                              bgcolor: 'error.light',
                              color: 'error.dark',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'success.main' }}>
                          {rep.closedWon}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'error.main' }}>
                          {rep.closedLost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                No underperforming reps found
              </Box>
            )}
          </Box>

          {/* Low Activity Accounts */}
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Low Activity Accounts
              </Typography>
              <Chip
                label={riskFactors.lowActivityAccounts.length}
                size="small"
                sx={{
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            {riskFactors.lowActivityAccounts.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: { xs: 180, sm: 200 },
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: 'none',
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Account
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Segment
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Deals
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: 'grey.50',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Days
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskFactors.lowActivityAccounts.map((account) => (
                      <TableRow
                        key={account.account_id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {account.name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={account.segment}
                            size="small"
                            sx={{
                              bgcolor: 'info.light',
                              color: 'info.dark',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {account.openDeals}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'warning.main' }}>
                          {account.daysSinceLastActivity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                No low activity accounts found
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RiskFactorsCard;
