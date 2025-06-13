import express from 'express';
import { fetchSpotifyData } from '../utils/spotifyRequest';
import type { SpotifyTopArtistsResponse, SpotifyTopTracksResponse, SpotifyPlaylistsResponse, SpotifyTrackResponse } from '../../types/spotify';
import type { Request, Response } from 'express';
import { fetchSummaryStats } from '../utils/summaryStats';
import axios from 'axios';

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

// GET endpoint for summmary stats data from spotify
router.get('/summary-stats', fetchSummaryStats);

// GET endpoint for most streamed track data from spotify
router.get('/most-streamed-track', async (req: Request, res: Response) => {
  const timeRange = req.query.time_range || 'long_term';

  await fetchSpotifyData<SpotifyTrackResponse>(`me/top/tracks?time_range=${timeRange}&limit=10`, req, res, async (data, _req, res) => {
    const tracks = data.items;

    if (!tracks || tracks.length === 0) {
      res.status(404).json({ error: 'No tracks found' });
      return;
    }

    const artistIds = [...new Set(tracks.flatMap((track) => track.artists?.map((artist) => artist.id)))];

    try {
      const artistResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
        headers: {
          Authorization: req.headers.authorization!,
        },
      });

      const artistMap: Record<string, { genres: string[]; popularity: number }> = {};

      artistResponse.data.artists.forEach((artist: any) => {
        artistMap[artist.id] = {
          genres: artist.genres,
          popularity: artist.popularity,
        };
      });

      const enrichedTracks = tracks.map((track) => {
        const artistId = track.artists?.[0]?.id;
        const artistData = artistMap[artistId] || { genres: [], popularity: 0 };

        return {
          ...track,
          genres: artistData.genres,
          popularity: artistData.popularity,
        };
      });

      res.json({ items: enrichedTracks });
    } catch (err) {
      console.error('Error fetching artist data:', err);
      res.json({ items: tracks }); // fallback to raw data
    }
  });
});

router.get('/top-genres-over-time', async (req, res) => {
  await fetchSpotifyData<any>('me/top/tracks?time_range=long_term&limit=1', req, res, async (_, req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Missing token' });
      return;
    }

    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    const results: Record<string, Record<string, number>> = {};

    try {
      for (const range of timeRanges) {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { time_range: range, limit: 50 },
        });

        const tracks = response.data.items;
        const genreCounts: Record<string, number> = {};

        for (const track of tracks) {
          const artistId = track.artists?.[0]?.id;
          if (!artistId) continue;

          const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const genres: string[] = artistResponse.data.genres || [];
          for (const genre of genres) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        }

        results[range] = genreCounts;
      }

      res.json(results);
    } catch (error) {
      console.error('Error fetching genre trends:', error);
      res.status(500).json({ error: 'Failed to fetch genre trends' });
    }
  });
});

export default router;
