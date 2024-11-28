import express from 'express';
import UploadController from '../controllers/uplaod.controller.js';
import upload from '../middleware/multerConfig.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router
  .route('/upload/coupon')
  .post(
    authMiddleware.verifyToken,
    upload.single('csvFile'),
    UploadController.uploadCoupons.bind(UploadController)
  );

export default router;
