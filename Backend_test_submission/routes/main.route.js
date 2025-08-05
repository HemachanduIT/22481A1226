import { Router } from 'express';
import { loggingMiddleware } from '../middleware/middleware.js';
import { createShortUrl, getShortUrlStats, redirectToOriginalUrl, healthCheck } from '../controllers/main.controller.js';

const router = Router();

router.post('/shorturls', loggingMiddleware, createShortUrl);
router.get('/shorturls/:shortcode', loggingMiddleware, getShortUrlStats);
router.get('/:shortcode', loggingMiddleware, redirectToOriginalUrl);
router.get('/health', loggingMiddleware, healthCheck);

export default router;