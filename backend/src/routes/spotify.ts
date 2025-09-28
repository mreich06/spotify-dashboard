import express from 'express';
import axios from 'axios';
import { createEmptyTimeRangeResult, fetchSpotifyData, getAccessToken, getTimeRangeData, timeRanges } from '../utils/spotifyRequest';
import { fetchSummaryStats } from '../utils/summaryStats';
import type {
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse,
  SpotifyTrackResponse,
  TimeRange,
} from '../types/spotify';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/top-artists', async (req: Request, res: Response) => {
  const timeRange = (req.query.time_range as TimeRange) || 'medium_term';
  await fetchSpotifyData<SpotifyTopArtistsResponse>(`me/top/artists?time_range=${timeRange}`, req, res);
});

router.get('/top-tracks', async (req: Request, res: Response) => {
  fetchSpotifyData<SpotifyTopTracksResponse>('me/top/tracks', req, res);
});

// TODO: move this to Playlists tab
router.get('/playlists', async (req: Request, res: Response): Promise<void> => {
  const token = getAccessToken(req);
  getTimeRangeData(token, res);

  const result = createEmptyTimeRangeResult<SpotifyPlaylistsResponse>({
    href: '',
    limit: 0,
    total: 0,
    items: [],
  });

  try {
    for (const range of timeRanges) {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10 },
      });

      // Just reuse the same response for all ranges (since Spotify playlists API doesn’t support time_range)
      result[range] = response.data;
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching top playlists:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

router.get('/summary-stats', fetchSummaryStats);

router.get('/most-streamed-track', async (req: Request, res: Response): Promise<void> => {
  const token = getAccessToken(req);
  getTimeRangeData(token, res);

  const result = createEmptyTimeRangeResult<SpotifyTrackResponse>({
    items: [],
  });

  try {
    for (const range of timeRanges) {
      const response = await axios.get<SpotifyTrackResponse>('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { time_range: range, limit: 10 },
      });

      const tracks = response.data.items;

      const artistIds = [...new Set(tracks.flatMap((track) => track.artists.map((a) => a.id)))];

      // Batch artist IDs to avoid hitting the 50 limit
      const batches = [];
      for (let i = 0; i < artistIds.length; i += 50) {
        batches.push(artistIds.slice(i, i + 50));
      }

      const artistMap: Record<string, { genres: string[]; popularity: number }> = {};

      for (const batch of batches) {
        try {
          const artistResponse = await axios.get('https://api.spotify.com/v1/artists', {
            headers: { Authorization: `Bearer ${token}` },
            params: { ids: batch.join(',') },
          });

          artistResponse.data.artists.forEach((artist: any) => {
            artistMap[artist.id] = {
              genres: artist.genres,
              popularity: artist.popularity,
            };
          });
        } catch (error: any) {
          console.error('Failed to fetch artist batch:', {
            ids: batch,
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        }
      }

      const enrichedTracks = tracks.map((track) => {
        const artistId = track.artists[0]?.id;
        const artistData = artistMap[artistId] || { genres: [], popularity: 0 };
        return {
          ...track,
          genres: artistData.genres,
          popularity: artistData.popularity,
        };
      });

      result[range] = {
        ...response.data,
        items: enrichedTracks,
      };
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching most streamed tracks:', err);
    res.status(500).json({ error: 'Failed to fetch most streamed tracks' });
  }
});

// genre counts reflect how often artists appear
// Each artists is fetched only once to reduce API calls, later weighted
// batch in order to reduce num of API calls
router.get('/top-genres-over-time', async (req: Request, res: Response): Promise<void> => {
  const token = getAccessToken(req);
  getTimeRangeData(token, res);

  const results: Record<TimeRange, Record<string, number>> = createEmptyTimeRangeResult({});

  try {
    for (const range of timeRanges) {
      // Get top 50 tracks for this time range
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { time_range: range, limit: 50 },
      });

      const tracks = response.data.items;

      // Count artist frequencies
      const artistFrequency: Record<string, number> = {};
      for (const track of tracks) {
        for (const artist of track.artists) {
          artistFrequency[artist.id] = (artistFrequency[artist.id] || 0) + 1;
        }
      }

      // Batch unique artist IDs (Spotify allows max 50 per request)
      const artistIds = Object.keys(artistFrequency);
      const batches: string[][] = [];
      for (let i = 0; i < artistIds.length; i += 50) {
        batches.push(artistIds.slice(i, i + 50));
      }

      // Fetch artists in batches and weight genres by frequency
      const genreCounts: Record<string, number> = {};
      for (const batch of batches) {
        const artistResponse = await axios.get('https://api.spotify.com/v1/artists', {
          headers: { Authorization: `Bearer ${token}` },
          params: { ids: batch.join(',') },
        });

        for (const artist of artistResponse.data.artists) {
          const multiplier = artistFrequency[artist.id]; // times this artist appeared
          for (const genre of artist.genres || []) {
            genreCounts[genre] = (genreCounts[genre] || 0) + multiplier;
          }
        }
      }

      //  Save results for this time range
      results[range] = genreCounts;
    }

    res.json(results);
  } catch (error: any) {
    console.error('Error fetching genre trends (batched weighted):', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to fetch genre trends' });
  }
});

export default router;
