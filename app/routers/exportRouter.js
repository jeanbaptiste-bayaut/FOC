import express from 'express';
import ExportController from '../controllers/export.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

router
  .route('/export/:startDate/:endDate')
  .get(
    authMiddleware.verifyToken,
    ExportController.exportCoupons.bind(ExportController)
  );

export default router;
