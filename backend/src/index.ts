import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import authRoutes from './routes/auth';
import spotifyRoutes from './routes/spotify';

// Express server setup for env, cors and to run on port 4000

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is working!');
});

app.use('/auth', authRoutes);
app.use('/', spotifyRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
