import { Router } from 'express';
import couponRouter from './couponRouter.js';
import userRouter from './userRouter.js';
import uploadRouter from './uploadRouter.js';
import reportRouter from './reportRouter.js';
import exportRouter from './exportRouter.js';
import FacturationCodeRouter from './facturationCodeRouter.js';

export const router = Router();

router.use('/api', couponRouter);
router.use('/api', userRouter);
router.use('/api', uploadRouter);
router.use('/api', reportRouter);
router.use('/api', exportRouter);
router.use('/api', FacturationCodeRouter);

export default router;
