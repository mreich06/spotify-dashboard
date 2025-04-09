import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { getAuthUrl, getTokens } from '../services/spotify';

dotenv.config();

const router = express.Router();

// redirect to OAuth upon login
router.get('/login', (req, res) => {
  const returnTo = req.query.returnTo || '/dashboard';
  const url = getAuthUrl(returnTo as string);
  res.redirect(url);
});

// get access token using auth code
router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Authorization code is missing in callback');
    return;
  }

  try {
    const tokens = await getTokens(code);
    // Redirect back to frontend with access token in query (temporary solution)
    // return them to page they originally came from with returnTo query param
    const returnTo = req.query.state || '/dashboard';
    // redirect with both access and refresh tokens
    res.redirect(`${process.env.FRONTEND_URL}${returnTo}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
  } catch (error) {
    console.log('Error getting access token:', error);
    res.status(500).send('Failed to get access token from Spotify');
  }
});

// get refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    res.status(400).json({ error: 'Missing refresh_token' });
  }
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching refresh token', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
