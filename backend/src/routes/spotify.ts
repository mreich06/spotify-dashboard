import express from 'express';
import { fetchSpotifyData } from '../utils/spotifyRequest';
import type { SpotifyTopArtistsResponse, SpotifyTopTracksResponse, SpotifyPlaylistsResponse } from '../../types/spotify';
import type { Request, Response } from 'express';

const router = express.Router();

// GET endpoint for top-artists data from Spotify
router.get('/top-artists', async (req: Request, res: Response) => {
  const timeRange = req.query.time_range || 'medium_term';
  fetchSpotifyData<SpotifyTopArtistsResponse>(`me/top/artists?time_range=${timeRange}`, req, res);
});

// GET endpoint for top-tracks data from spotify
router.get('/top-tracks', async (req: Request, res: Response) => {
  fetchSpotifyData<SpotifyTopTracksResponse>('me/top/tracks', req, res);
});

// GET endpoint for playlists data from spotify
router.get('/playlists', async (req: Request, res: Response) => {
  fetchSpotifyData<SpotifyPlaylistsResponse>('me/playlists', req, res);
});

export default router;
