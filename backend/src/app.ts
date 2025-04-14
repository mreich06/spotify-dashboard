import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import spotifyRoutes from './routes/spotify';

// defines and exports the Express app

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', spotifyRoutes);

export default app;
