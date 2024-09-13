import express from 'express';
import ReportController from '../controllers/report.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

router
  .route('/report/coupons-by-amount')
  .get(
    authMiddleware.verifyToken,
    ReportController.getNbCouponsByAmountByBrand.bind(ReportController)
  );

router
  .route('/report/amount-by-brand')
  .get(
    authMiddleware.verifyToken,
    ReportController.getAmountByBrand.bind(ReportController)
  );

router
  .route('/report/amount-by-period/:startDate/:endDate')
  .post(
    authMiddleware.verifyToken,
    ReportController.getAmountAndNbOfCouopnByTimePeriod.bind(ReportController)
  )
  .get(
    authMiddleware.verifyToken,
    ReportController.getAmountAndNbOfCouopnByTimePeriod.bind(ReportController)
  );

export default router;
