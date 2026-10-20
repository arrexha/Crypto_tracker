import { PORT, CLIENT_URL } from './config/env.js';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';

const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

connectDatabase().then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/favorites', favoritesRoutes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
