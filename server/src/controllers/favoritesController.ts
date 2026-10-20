import { Response } from 'express';
import { FavoriteModel } from '../models/Favorite.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await FavoriteModel.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json(favorites.map((favorite) => favorite.cryptoId));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { cryptoId } = req.body;

    if (!cryptoId || typeof cryptoId !== 'string') {
      return res.status(400).json({ error: 'Crypto ID is required' });
    }

    const favorite = new FavoriteModel({
      userId: req.userId,
      cryptoId
    });

    await favorite.save();

    res.status(201).json({ message: 'Favorite added successfully', cryptoId });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This crypto is already in your favorites' });
    }
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { cryptoId } = req.params;

    const result = await FavoriteModel.findOneAndDelete({
      userId: req.userId,
      cryptoId
    });

    if (!result) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
