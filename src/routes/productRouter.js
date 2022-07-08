import { Router} from 'express';
import {createProduct, getProducts, addItems, getCart} from '../controllers/productController.js';

const router = Router();
router.post('/products', createProduct);
router.get('/products/:productType', getProducts);
router.post('/cart', addItems);
router.get('/cart', getCart);
export default router;