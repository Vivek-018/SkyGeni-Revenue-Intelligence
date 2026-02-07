import React, { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SpeedIcon from '@mui/icons-material/Speed';
import * as d3 from 'd3';
import { Drivers } from '../types';

interface DriversCardProps {
  drivers: Drivers;
}

const DriversCard: React.FC<DriversCardProps> = ({ drivers }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth - 32, 600);
        setDimensions({ width, height: Math.max(200, width * 0.5) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!chartRef.current || dimensions.width === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 40, left: 70 };

    const data = [
      { label: 'Pipeline Size', value: drivers.pipelineSize },
      { label: 'Avg Deal Size', value: drivers.averageDealSize },
    ];

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const maxValue = d3.max(data, (d) => d.value) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const formatCurrency = (value: number) => {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
      return `$${value.toFixed(0)}`;
    };

    // Draw bars with gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#534bae');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#1a237e');

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.label) || 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.value))
      .attr('fill', 'url(#barGradient)')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
      });

    // Add value labels on bars
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#1a237e')
      .text((d) => formatCurrency(d.value));

    // Add x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#666');

    // Add y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat((d) => formatCurrency(d as number)))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#666');

    svg.selectAll('.domain, .tick line').attr('stroke', '#e0e0e0');
  }, [drivers, dimensions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = [
    {
      label: 'Pipeline Size',
      value: formatCurrency(drivers.pipelineSize),
      color: 'primary.main',
      bgColor: 'rgba(26, 35, 126, 0.08)',
    },
    {
      label: 'Win Rate',
      value: `${drivers.winRate.toFixed(1)}%`,
      color: 'success.main',
      bgColor: 'rgba(76, 175, 80, 0.08)',
    },
    {
      label: 'Avg Deal Size',
      value: formatCurrency(drivers.averageDealSize),
      color: 'info.main',
      bgColor: 'rgba(33, 150, 243, 0.08)',
    },
    {
      label: 'Sales Cycle',
      value: `${drivers.salesCycleTime} days`,
      color: 'warning.main',
      bgColor: 'rgba(255, 152, 0, 0.08)',
    },
  ];

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
          <SpeedIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Revenue Drivers
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: metric.bgColor,
                  border: `1px solid ${metric.color}20`,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: metric.color,
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  }}
                >
                  {metric.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          ref={containerRef}
          sx={{
            mt: 'auto',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 2,
            background: '#fafafa',
            p: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 1,
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Pipeline vs Deal Size Comparison
          </Typography>
          <svg
            ref={chartRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ maxWidth: '100%', height: 'auto' }}
          ></svg>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DriversCard;
