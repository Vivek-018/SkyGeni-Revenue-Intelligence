import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Recommendation } from '../types';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'error.light', color: 'error.dark', border: 'error.main' };
      case 'medium':
        return { bg: 'warning.light', color: 'warning.dark', border: 'warning.main' };
      case 'low':
        return { bg: 'info.light', color: 'info.dark', border: 'info.main' };
      default:
        return { bg: 'grey.200', color: 'grey.700', border: 'grey.400' };
    }
  };

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
          <LightbulbIcon sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Recommendations
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {recommendations.map((rec, index) => {
            const priorityColors = getPriorityColor(rec.priority);
            return (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    mb: index < recommendations.length - 1 ? 2 : 0,
                    borderRadius: 2,
                    bgcolor: `${priorityColors.bg}15`,
                    border: `2px solid ${priorityColors.border}40`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: `${priorityColors.bg}25`,
                      borderColor: priorityColors.border,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1.5} mb={1.5} flexWrap="wrap">
                        <Chip
                          label={rec.priority.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: priorityColors.bg,
                            color: priorityColors.color,
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: 24,
                            letterSpacing: '0.5px',
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          }}
                        >
                          {rec.title}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mb: 1.5,
                            lineHeight: 1.6,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                          }}
                        >
                          {rec.description}
                        </Typography>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: 'primary.light',
                            borderLeft: `4px solid ${priorityColors.border}`,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: 'primary.dark',
                              mb: 0.5,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Recommended Action
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              fontWeight: 600,
                              fontSize: { xs: '0.875rem', sm: '0.9rem' },
                              lineHeight: 1.5,
                            }}
                          >
                            {rec.action}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recommendations.length - 1 && (
                  <Divider
                    component="li"
                    sx={{
                      my: 2,
                      borderColor: 'divider',
                      opacity: 0.3,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
