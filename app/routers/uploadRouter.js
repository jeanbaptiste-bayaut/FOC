import express from 'express';
import UploadController from '../controllers/uplaod.controller.js';
import upload from '../middleware/multerConfig.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/* tags:
 *   name: Uplaod
 *   description: API to manage uplaod of coupons
 */

/**
 * @swagger
 * /upload/coupon:
 *   post:
 *     summary: Upload coupons
 *     description: >
 *       Upload a CSV file containing coupons with the following headers:
 *       - **code**: string, the unique code of the coupon
 *       - **amount**: number, the discount amount
 *       - **wetsuit**: string, true or false, whether the coupon works with wetsuits products
 *       - **status**: string, the status of the coupon 0 for active, 1 for used
 *       - **country_id**: number, the ID of the country where the coupon is valid (reference to the countries table)
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvFile:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to upload
 *             required:
 *               - csvFile
 *     responses:
 *       200:
 *         description: Coupons uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router
  .route('/upload/coupon')
  .post(
    authMiddleware.verifyToken,
    upload.single('csvFile'),
    UploadController.uploadCoupons.bind(UploadController)
  );

export default router;
