import { Router} from 'express';
import {createProduct, getProducts, addItems, getCart, favoriteItem, getFavorites, payOrder, deleteCart, getOrders} from '../controllers/productController.js';
import validateUser from '../middlewares/validateUser.js';

const router = Router();
router.post('/products', createProduct);
router.get('/products/:productType', getProducts);
router.post('/cart', validateUser, addItems);
router.get('/cart', validateUser, getCart);
router.delete('/cart',validateUser, deleteCart);
router.post('/favorite/:action', validateUser, favoriteItem);
router.get('/favorite', validateUser, getFavorites);
router.post('/order',validateUser, payOrder);
router.get('/order',validateUser, getOrders);
export default router;