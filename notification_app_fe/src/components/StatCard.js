/**
 * StatCard
 * --------
 * A small summary card showing a count and label.
 * Used on the dashboard to give an at-a-glance overview.
 */

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ icon, label, count, color = 'primary.main' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}22`,
              color,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.5px">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color={color}>
          {count ?? '—'}
        </Typography>
      </CardContent>
    </Card>
  );
}
