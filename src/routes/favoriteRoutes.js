import { Router} from 'express';
import {favoriteItem, getFavorites} from '../controllers/favoriteController.js';
import validateUser from '../middlewares/validateUser.js';

const router = Router();

router.post('/favorite/:action', validateUser, favoriteItem);
router.get('/favorite', validateUser, getFavorites);

export default router;