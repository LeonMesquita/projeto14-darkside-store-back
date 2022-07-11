import { Router} from 'express';
import {payOrder, getOrders} from '../controllers/orderController.js';
import validateUser from '../middlewares/validateUser.js';

const router = Router();

router.post('/order',validateUser, payOrder);
router.get('/order',validateUser, getOrders);

export default router;