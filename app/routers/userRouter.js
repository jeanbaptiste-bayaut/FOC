import express from 'express';
import UserController from '../controllers/user.controller.js';
const router = express.Router();
import authMiddleware from '../middleware/auth.middleware.js';

router.route('/users').get(UserController.getAll.bind(UserController));
router.route('/users/:id').get(UserController.getOne.bind(UserController));

router.route('/login').post(UserController.login.bind(UserController));
router
  .route('/signin')
  .post(authMiddleware.verifyToken, UserController.signin.bind(UserController));

export default router;
