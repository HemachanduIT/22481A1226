import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StatsPanel = ({ stats, urls, fetchStats }) => {
  if (!stats) return <Typography align="center">Select a URL to view stats.</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Stats for <strong>{stats.shortcode}</strong>
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Total Clicks: {stats.clicks}</Typography>
        <Typography>Created At: {new Date(stats.createdAt).toLocaleString()}</Typography>
        <Typography>Expires At: {new Date(stats.expiry).toLocaleString()}</Typography>
        <Typography>Original URL: {stats.originalUrl}</Typography>
      </Paper>
    </Box>
  );
};

export default StatsPanel;
