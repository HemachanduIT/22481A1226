import React from 'react';
import { Typography, Box } from '@mui/material';

const Header = () => (
  <Box textAlign="center" mb={4}>
    <Typography variant="h3" component="h1" gutterBottom>
      🔗 URL Shortener
    </Typography>
    <Typography variant="subtitle1">
      Create and manage your shortened URLs with ease.
    </Typography>
  </Box>
);

export default Header;
