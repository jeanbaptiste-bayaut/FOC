import express from 'express';
import CouponController from '../controllers/coupon.controller.js';
const router = express.Router();

router
  .route('/coupon/:brand/:country/:nbcoupons')
  .get(CouponController.getCouponByBrandCountry.bind(CouponController));

router
  .route('/freeshipping/:brand/:country/:nbcoupons')
  .get(CouponController.getFreeshippingByBrandCountry.bind(CouponController));

export default router;
