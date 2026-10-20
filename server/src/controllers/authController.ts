import { Request, Response } from 'express';
import { UserModel, IUser } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const toPublicUser = (user: IUser) => ({
  id: user.id as string,
  username: user.username,
  email: user.email
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const username = email.split('@')[0];

    const user = new UserModel({
      username,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user.id),
      user: toPublicUser(user)
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await user.verifyPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user.id),
      user: toPublicUser(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
