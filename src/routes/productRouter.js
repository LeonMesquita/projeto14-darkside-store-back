import { Router} from 'express';
import {createProduct} from '../controllers/productController.js';

const router = Router();
router.post('/products', createProduct);

export default router;