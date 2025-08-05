import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, Alert } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import Header from './components/Header';
import URLForm from './components/URLForm';
import URLList from './components/URLList';
import StatsPanel from './components/StatsPanel';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [url, setUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUrlStats, setSelectedUrlStats] = useState(null);

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    const stored = localStorage.getItem('shortenedUrls');
    if (stored) setShortenedUrls(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const validateUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shortenUrl = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!url.trim()) return setError('Please enter a URL'), setIsLoading(false);
    if (!validateUrl(url)) return setError('Invalid HTTP/HTTPS URL'), setIsLoading(false);
    if (validity < 1) return setError('Validity must be at least 1 minute'), setIsLoading(false);

    try {
      const body = { url: url.trim(), validity };
      if (customShortcode.trim()) body.shortcode = customShortcode.trim();

      const res = await fetch(`${API_BASE}/api/shorturls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Shortening failed');

      const newEntry = {
        id: Date.now().toString(),
        originalUrl: url,
        shortLink: data.shortLink,
        expiry: data.expiry,
        createdAt: new Date().toISOString(),
        shortcode: data.shortLink.split('/').pop()
      };

      setShortenedUrls(prev => [newEntry, ...prev]);
      setSuccess('URL shortened successfully!');
      setUrl('');
      setCustomShortcode('');
      setValidity(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUrlStats = async (shortcode) => {
    try {
      const res = await fetch(`${API_BASE}/api/shorturls/${shortcode}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const stats = await res.json();
      setSelectedUrlStats(stats);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab icon={<LinkIcon />} label="URL Shortener" />
          <Tab icon={<BarChartIcon />} label="Statistics" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {activeTab === 0 && (
        <>
          <URLForm
            url={url}
            setUrl={setUrl}
            customShortcode={customShortcode}
            setCustomShortcode={setCustomShortcode}
            validity={validity}
            setValidity={setValidity}
            isLoading={isLoading}
            onSubmit={shortenUrl}
          />
          <URLList urls={shortenedUrls} fetchStats={fetchUrlStats} />
        </>
      )}

      {activeTab === 1 && (
        <StatsPanel stats={selectedUrlStats} urls={shortenedUrls} fetchStats={fetchUrlStats} />
      )}
    </Container>
  );
};

export default App;