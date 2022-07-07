import { Router} from 'express';
import {createProduct, getProducts} from '../controllers/productController.js';

const router = Router();
router.post('/products', createProduct);
router.get('/products', getProducts);
export default router;