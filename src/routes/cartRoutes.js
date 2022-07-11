import { Router} from 'express';
import {addItems, getCart, deleteCart} from '../controllers/cartController.js';
import validateUser from '../middlewares/validateUser.js';


const router = Router();

router.post('/cart', validateUser, addItems);
router.get('/cart', validateUser, getCart);
router.delete('/cart',validateUser, deleteCart);

export default router;