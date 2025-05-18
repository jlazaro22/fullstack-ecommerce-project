import { Router } from 'express';
import { createOrderWithItemsSchema } from 'src/db/ordersSchema.js';
import { verifyToken } from 'src/middlewares/authMiddleware.js';
import { validateData } from 'src/middlewares/validationMiddleware.js';
import { createOrder } from './ordersController.js';

const router: Router = Router();

router.post(
  '/',
  verifyToken,
  validateData(createOrderWithItemsSchema),
  createOrder,
);

export default router;
