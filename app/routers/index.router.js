import { Router } from 'express';
import couponRouter from './couponRouter.js';
import userRouter from './userRouter.js';

export const router = Router();

router.use('/api', couponRouter);
router.use('/api', userRouter);

export default router;
