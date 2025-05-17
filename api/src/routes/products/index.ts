import { Router } from 'express';
import {
  createProductSchema,
  updateProductSchema,
} from 'src/db/productsSchema';
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
router.post('/', validateData(createProductSchema), createProduct);
router.put('/:id', validateData(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
