import { Router} from 'express';
import {createProduct, getProducts, addItems, getCart, favoriteItem, getFavorites, payOrder, deleteCart, getOrders} from '../controllers/productController.js';

const router = Router();
router.post('/products', createProduct);
router.get('/products/:productType', getProducts);
router.post('/cart', addItems);
router.get('/cart', getCart);
router.post('/favorite/:action', favoriteItem);
router.get('/favorite', getFavorites);
router.post('/order', payOrder);
router.get('/order', getOrders);
export default router;