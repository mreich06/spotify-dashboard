import express from 'express';
import axios from 'axios';
import { fetchSpotifyData } from '../utils/spotifyRequest';
import { fetchSummaryStats } from '../utils/summaryStats';
import type {
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse,
  SpotifyTrackResponse,
  TimeRange,
} from '../../types/spotify';
import type { Request, Response } from 'express';

const router = express.Router();

// router.get('/top-artists', async (req: Request, res: Response) => {
//   const timeRange = (req.query.time_range as TimeRange) || 'medium_term';
//   await fetchSpotifyData<SpotifyTopArtistsResponse>(`me/top/artists?time_range=${timeRange}`, req, res);
// });

// router.get('/top-tracks', async (req: Request, res: Response) => {
//   fetchSpotifyData<SpotifyTopTracksResponse>('me/top/tracks', req, res);
// });

// router.get('/playlists', async (req: Request, res: Response) => {
//   fetchSpotifyData<SpotifyPlaylistsResponse>('me/playlists', req, res);
// });

// router.get('/summary-stats', fetchSummaryStats);

router.get('/most-streamed-track', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  const timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];
  const result: Record<TimeRange, SpotifyTrackResponse> = {
    short_term: { items: [] },
    medium_term: { items: [] },
    long_term: { items: [] },
  };

  console.log();

  try {
    for (const range of timeRanges) {
      const response = await axios.get<SpotifyTrackResponse>('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { time_range: range, limit: 10 },
      });

      const tracks = response.data.items;

      console.log('tracks are', tracks);
      const artistIds = [...new Set(tracks.flatMap((track) => track.artists.map((a) => a.id)))];
      console.log('artistIds are', artistIds);

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
          console.error('❌ Failed to fetch artist batch:', {
            ids: batch,
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        }
      }

      console.log('batches is', batches);

      const enrichedTracks = tracks.map((track) => {
        const artistId = track.artists[0]?.id;
        const artistData = artistMap[artistId] || { genres: [], popularity: 0 };
        return {
          ...track,
          genres: artistData.genres,
          popularity: artistData.popularity,
        };
      });
      console.log('enrichedTracks is', enrichedTracks);

      result[range] = {
        ...response.data,
        items: enrichedTracks,
      };
    }
    console.log('result is', result);

    res.json(result);
  } catch (err) {
    console.error('Error fetching most streamed tracks:', err);
    res.status(500).json({ error: 'Failed to fetch most streamed tracks' });
  }
});

// router.get('/top-genres-over-time', async (req, res) => {
//   await fetchSpotifyData<any>('me/top/tracks?time_range=long_term&limit=1', req, res, async (_, req, res) => {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     if (!token) {
//       res.status(401).json({ error: 'Missing token' });
//       return;
//     }

//     const timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];
//     const results: Record<string, Record<string, number>> = {};

//     try {
//       for (const range of timeRanges) {
//         const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { time_range: range, limit: 50 },
//         });

//         const tracks = response.data.items;
//         const genreCounts: Record<string, number> = {};

//         for (const track of tracks) {
//           const artistId = track.artists?.[0]?.id;
//           if (!artistId) continue;

//           const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           const genres: string[] = artistResponse.data.genres || [];
//           for (const genre of genres) {
//             genreCounts[genre] = (genreCounts[genre] || 0) + 1;
//           }
//         }

//         results[range] = genreCounts;
//       }

//       res.json(results);
//     } catch (error) {
//       console.error('Error fetching genre trends:', error);
//       res.status(500).json({ error: 'Failed to fetch genre trends' });
//     }
//   });
// });

export default router;
