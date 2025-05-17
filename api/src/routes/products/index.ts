import { Router } from 'express';
import {
  createProductSchema,
  updateProductSchema,
} from 'src/db/productsSchema';
import { verifySeller, verifyToken } from 'src/middlewares/authMiddleware';
import { validateData } from 'src/middlewares/validationMiddleware';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from './productsController';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post(
  '/',
  verifyToken,
  verifySeller,
  validateData(createProductSchema),
  createProduct,
);
router.put(
  '/:id',
  verifyToken,
  verifySeller,
  validateData(updateProductSchema),
  updateProduct,
);
router.delete('/:id', verifyToken, verifySeller, deleteProduct);

export default router;
