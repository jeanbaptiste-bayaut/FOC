import express from 'express';
import ExportController from '../controllers/export.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

/**
 * @swagger
 * /export/{startDate}/{endDate}:
 *   get:
 *     summary: Export coupons between startDate and endDate
 *     tags: [Export]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: The start date for the export
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: The end date for the export
 *     responses:
 *       200:
 *         description: Coupons exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router
  .route('/export/:startDate/:endDate')
  .get(
    authMiddleware.verifyToken,
    ExportController.exportCoupons.bind(ExportController)
  );

export default router;
