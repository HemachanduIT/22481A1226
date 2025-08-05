import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { logger } from '../server.js';


// make this into a middleware function to use in all routes
const loggingMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
};

export { loggingMiddleware, logger };