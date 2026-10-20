import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:cryptoId', removeFavorite);

export default router;
