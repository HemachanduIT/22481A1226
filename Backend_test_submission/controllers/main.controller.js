import { logger } from '../server.js';
import express from 'express';
import { isValidUrl, getUniqueShortcode, generateShortcode } from '../utils/helper.js';
import { urlDatabase, statsDatabase } from "../db/index.js";
import { v4 as uuidv4 } from 'uuid';


export const createShortUrl = (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    // Validate required fields
    if (!url) {
      logger.error('URL creation failed: Missing URL', { body: req.body });
      return res.status(400).json({
        error: 'URL is required'
      });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      logger.error('URL creation failed: Invalid URL format', { url });
      return res.status(400).json({
        error: 'Invalid URL format. Must be a valid HTTP/HTTPS URL'
      });
    }

    // Set validity (default to 30 minutes if not provided)
    const validityMinutes = validity || 30;
    const expiryDate = new Date(Date.now() + validityMinutes * 60 * 1000);

    // Generate or validate custom shortcode
    let finalShortcode;
    try {
      finalShortcode = getUniqueShortcode(shortcode);
    } catch (error) {
      logger.error('Shortcode generation failed', { error: error.message, shortcode });
      return res.status(409).json({
        error: error.message
      });
    }

    // Store URL data
    const urlData = {
      id: uuidv4(),
      originalUrl: url,
      shortcode: finalShortcode,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      clickCount: 0
    };

    urlDatabase.set(finalShortcode, urlData);
    
    // Initialize stats
    statsDatabase.set(finalShortcode, {
      totalClicks: 0,
      clicks: []
    });

    logger.info('Short URL created successfully', {
      shortcode: finalShortcode,
      originalUrl: url,
      expiryDate: expiryDate.toISOString()
    });

    // Return response
    res.status(201).json({
      shortLink: `http://hostname:port/${finalShortcode}`,
      expiry: expiryDate.toISOString()
    });

  } catch (error) {
    logger.error('Internal server error during URL creation', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Retrieve Short URL Statistics (GET)
export const getShortUrlStats = (req, res) => {
  try {
    const { shortcode } = req.params;

    // Check if shortcode exists
    if (!urlDatabase.has(shortcode)) {
      logger.warn('Statistics requested for non-existent shortcode', { shortcode });
      return res.status(404).json({
        error: 'Shortcode not found'
      });
    }

    const urlData = urlDatabase.get(shortcode);
    const stats = statsDatabase.get(shortcode);

    logger.info('Statistics retrieved', { shortcode });

    res.json({
      shortcode,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiryDate: urlData.expiryDate,
      totalClicks: stats.totalClicks,
      clickDetails: stats.clicks.map(click => ({
        timestamp: click.timestamp,
        source: click.source,
        location: click.location || 'Unknown'
      }))
    });

  } catch (error) {
    logger.error('Internal server error during statistics retrieval', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Redirection endpoint (GET)
export const redirectToOriginalUrl = (req, res) => {
  try {
    const { shortcode } = req.params;

    // Check if shortcode exists
    if (!urlDatabase.has(shortcode)) {
      logger.warn('Redirection attempted for non-existent shortcode', { shortcode });
      return res.status(404).json({
        error: 'Shortcode not found'
      });
    }

    const urlData = urlDatabase.get(shortcode);
    const currentTime = new Date();
    const expiryTime = new Date(urlData.expiryDate);

    // Check if URL has expired
    if (currentTime > expiryTime) {
      logger.warn('Redirection attempted for expired shortcode', { 
        shortcode, 
        expiryDate: urlData.expiryDate 
      });
      return res.status(410).json({
        error: 'Short URL has expired'
      });
    }

    // Record click statistics
    const stats = statsDatabase.get(shortcode);
    const clickData = {
      timestamp: currentTime.toISOString(),
      source: req.get('Referer') || 'Direct',
      location: req.ip || 'Unknown',
      userAgent: req.get('User-Agent')
    };

    stats.totalClicks += 1;
    stats.clicks.push(clickData);
    statsDatabase.set(shortcode, stats);

    // Update click count in URL data
    urlData.clickCount += 1;
    urlDatabase.set(shortcode, urlData);

    logger.info('Successful redirection', {
      shortcode,
      originalUrl: urlData.originalUrl,
      clickCount: urlData.clickCount
    });

    // Redirect to original URL
    res.redirect(urlData.originalUrl);

  } catch (error) {
    logger.error('Internal server error during redirection', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Health check endpoint
export const healthCheck = (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};