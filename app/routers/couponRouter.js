import express from 'express';
import CouponController from '../controllers/coupon.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

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
