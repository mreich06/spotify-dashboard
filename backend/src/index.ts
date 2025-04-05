import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAuthUrl, getTokens } from './spotify';

// Express server setup for env, cors and to run on port 4000

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/login', (req, res) => {
  res.redirect(getAuthUrl());
});

app.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const tokens = await getTokens(code);

  // Redirect back to frontend with access token in query (temporary solution)
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${tokens.access_token}`);
});
