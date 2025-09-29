import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { analyticsGet } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, analyticsGet);

export default router;
