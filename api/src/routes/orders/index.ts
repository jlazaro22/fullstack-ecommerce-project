import { Router } from 'express';
import {
  createOrderWithItemsSchema,
  updateOrderSchema,
} from 'src/db/ordersSchema.js';
import { verifyToken } from 'src/middlewares/authMiddleware.js';
import { validateData } from 'src/middlewares/validationMiddleware.js';
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
} from './ordersController.js';

const router: Router = Router();

router.get('/', verifyToken, listOrders);
router.get('/:id', verifyToken, getOrderById);
router.post(
  '/',
  verifyToken,
  validateData(createOrderWithItemsSchema),
  createOrder,
);
router.put('/:id', verifyToken, validateData(updateOrderSchema), updateOrder);

export default router;
