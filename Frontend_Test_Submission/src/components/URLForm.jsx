import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const URLForm = ({
  url,
  setUrl,
  customShortcode,
  setCustomShortcode,
  validity,
  setValidity,
  isLoading,
  onSubmit
}) => (
  <Box component="form" onSubmit={onSubmit} sx={{ mb: 4 }}>
    <TextField
      fullWidth
      label="Enter URL"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      margin="normal"
      required
    />
    <TextField
      fullWidth
      label="Custom Shortcode (optional)"
      value={customShortcode}
      onChange={(e) => setCustomShortcode(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Validity (minutes)"
      type="number"
      value={validity}
      onChange={(e) => setValidity(Number(e.target.value))}
      margin="normal"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <AccessTimeIcon />
          </InputAdornment>
        )
      }}
      required
    />
    <Button
      type="submit"
      variant="contained"
      color="secondary"
      fullWidth
      disabled={isLoading}
      sx={{ mt: 2 }}
    >
      {isLoading ? 'Shortening...' : 'Shorten URL'}
    </Button>
  </Box>
);

export default URLForm;
