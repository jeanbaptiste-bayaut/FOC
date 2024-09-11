import express from 'express';
import UploadController from '../controllers/uplaod.controller.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router
  .route('/upload/coupon')
  .post(
    upload.single('csvFile'),
    UploadController.uploadCoupons.bind(UploadController)
  );

export default router;
