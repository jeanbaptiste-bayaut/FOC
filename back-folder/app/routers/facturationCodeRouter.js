import express from 'express';
import FacturationCodeController from '../controllers/facturationCode.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

router
  .route('/facturation-codes/:id')
  .get(FacturationCodeController.getOne.bind(FacturationCodeController))
  .post(
    authMiddleware.verifyToken,
    FacturationCodeController.addFacturationCodeToUser.bind(
      FacturationCodeController
    )
  )
  .delete(
    authMiddleware.verifyToken,
    FacturationCodeController.deleteFacturationCodeFromUser.bind(
      FacturationCodeController
    )
  );

export default router;
