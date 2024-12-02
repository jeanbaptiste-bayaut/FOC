import express from 'express';
import ReportController from '../controllers/report.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

/**
 * @swagger
 * /report/coupons-by-amount/{startDate}/{endDate}:
 *   get:
 *     summary: Get number of coupons by amount by brand
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report
 *     responses:
 *       200:
 *         description: Successfully retrieved report
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /report/amount-by-brand/{startDate}/{endDate}:
 *   get:
 *     summary: Get amount by brand
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report
 *     responses:
 *       200:
 *         description: Successfully retrieved report
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router
  .route('/report/coupons-by-amount')
  .post(
    authMiddleware.verifyToken,
    ReportController.getNbCouponsByAmountByBrand.bind(ReportController)
  );

router
  .route('/report/amount-by-brand')
  .post(
    authMiddleware.verifyToken,
    ReportController.getAmountByBrand.bind(ReportController)
  );

router
  .route('/report/amount-by-period')
  .post(
    authMiddleware.verifyToken,
    ReportController.getAmountAndNbOfCouopnByTimePeriod.bind(ReportController)
  );

export default router;
