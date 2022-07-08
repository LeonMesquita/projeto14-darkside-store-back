import { Router} from 'express';
import {createProduct, getProducts, addItems} from '../controllers/productController.js';

const router = Router();
router.post('/products', createProduct);
router.get('/products/:productType', getProducts);
router.post('/cart', addItems);
export default router;