import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAuthUrl, getTokens } from './spotify';
import { SpotifyTopArtistsResponse, SpotifyTopTracksResponse } from '../types/spotify';
import type { Request, Response } from 'express';
import { fetchSpotifyData } from './spotifyRequest';

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

app.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Authorization code is missing in callback');
    return;
  }

  try {
    const tokens = await getTokens(code);
    // Redirect back to frontend with access token in query (temporary solution)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${tokens.access_token}`);
  } catch (error) {
    console.log('Error getting access token:', error);
    res.status(500).send('Failed to get access token from Spotify');
  }
});

// GET endpoint for top-artists data from Spotify
app.get('/top-artists', async (req, res) => {
  fetchSpotifyData<SpotifyTopArtistsResponse>('me/top/artists', req, res);
});

// GET endpoint for top-tracks data from spotify
app.get('/top-tracks', async (req, res) => {
  fetchSpotifyData<SpotifyTopTracksResponse>('me/top/tracks', req, res);
});
