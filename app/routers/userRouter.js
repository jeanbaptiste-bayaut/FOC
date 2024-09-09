import express from 'express';
import UserController from '../controllers/user.controller.js';
const router = express.Router();

router.route('/users').get(UserController.getAll.bind(UserController));
router.route('/users/:id').get(UserController.getOne.bind(UserController));

router.route('/login').post(UserController.login.bind(UserController));
router.route('/signin').post(UserController.signin.bind(UserController));

export default router;
