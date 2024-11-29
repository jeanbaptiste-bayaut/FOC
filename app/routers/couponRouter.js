import express from 'express';
import CouponController from '../controllers/coupon.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

/* tags:
 *   name: Coupons
 *   description: API to manage coupons
 */

/**
 * @swagger
 * /coupon/{brand}/{country}/{amount}/{nbcoupons}/{wetsuit}/{facturationCode}:
 *   get:
 *     summary: Retrieve list of coupon by brand and country
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: brand
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand of the coupon
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country of the coupon
 *       - in: path
 *         name: amount
 *         schema:
 *           type: number
 *         required: true
 *         description: The amount of the coupon
 *       - in: path
 *         name: nbcoupons
 *         schema:
 *           type: number
 *         required: true
 *         description: The number of coupons
 *       - in: path
 *         name: wetsuit
 *         schema:
 *           type: string
 *           format: true | false
 *         required: true
 *         description: The wetsuit associated with the coupon
 *       - in: path
 *         name: facturationCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The facturation code of the coupon
 *     responses:
 *       200:
 *         description: A coupon object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 country:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 nbcoupons:
 *                   type: number
 *                 wetsuit:
 *                   type: string
 *                 facturationCode:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /freeshipping/{brand}/{country}/{nbcoupons}:
 *   get:
 *     summary: Retrieve free shipping coupons by brand and country
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: brand
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand of the coupon
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country of the coupon
 *       - in: path
 *         name: nbcoupons
 *         schema:
 *           type: number
 *         required: true
 *         description: The number of coupons
 *     responses:
 *       200:
 *         description: A list of free shipping coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   country:
 *                     type: string
 *                   nbcoupons:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupons not found
 */

router
  .route('/coupon/:brand/:country/:amount/:nbcoupons/:wetsuit/:facturationCode')
  .get(
    authMiddleware.verifyToken,
    CouponController.getCouponByBrandCountry.bind(CouponController)
  );

router
  .route('/freeshipping/:brand/:country/:nbcoupons')
  .get(
    authMiddleware.verifyToken,
    CouponController.getFreeshippingByBrandCountry.bind(CouponController)
  );

export default router;
