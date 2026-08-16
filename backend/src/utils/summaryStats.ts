import type { Request, Response } from 'express';
import { fetchSpotify, getAccessToken, getRefreshToken, timeRanges, createEmptyTimeRangeResult } from '../utils/spotifyRequest';

interface SummaryStats {
  totalTracks: number;
  totalMinutes: string;
  avgMinutesPerDay: number;
  avgPlaysPerDay: number;
  genres: { name: string; count: number }[];
}

export const fetchSummaryStats = async (req: Request, res: Response): Promise<void> => {
  const token = getAccessToken(req);
  const refreshToken = getRefreshToken(req);
  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  const result = createEmptyTimeRangeResult<SummaryStats>({
    totalTracks: 0,
    totalMinutes: '0.0',
    avgMinutesPerDay: 0,
    avgPlaysPerDay: 0,
    genres: [],
  });

  try {
    for (const range of timeRanges) {
      const data = await fetchSpotify<{ items: any[] }>(
        'https://api.spotify.com/v1/me/top/tracks',
        token,
        refreshToken ?? '',
        { time_range: range, limit: 50 },
        2,
        res,
      );

      const items = data.items;
      if (!items || !Array.isArray(items)) continue;

      const totalTracks = items.length;
      const totalMinutes = items.reduce((sum: number, track: any) => sum + track.duration_ms / 60000, 0);
      const days = range === 'short_term' ? 28 : range === 'medium_term' ? 180 : 730;
      const avgMinutesPerDay = +(totalMinutes / days).toFixed(1);
      const avgPlaysPerDay = +(totalTracks / days).toFixed(1);

      const artistIds = Array.from(new Set(items.flatMap((track: any) => track.artists.map((artist: any) => artist.id)))).slice(0, 50);
      const genreMap: Record<string, number> = {};

      if (artistIds.length > 0) {
        const artistData = await fetchSpotify<{ artists: any[] }>(
          'https://api.spotify.com/v1/artists',
          token,
          refreshToken ?? '',
          { ids: artistIds.join(',') },
          2,
          res,
        );

        artistData.artists.forEach((artist: any) => {
          artist.genres.forEach((genre: string) => {
            genreMap[genre] = (genreMap[genre] || 0) + 1;
          });
        });
      }

      const genres = Object.entries(genreMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      result[range] = {
        totalTracks,
        totalMinutes: totalMinutes.toFixed(1),
        avgMinutesPerDay,
        avgPlaysPerDay,
        genres,
      };
    }

    res.json(result);
  } catch (err: any) {
    console.error('Error fetching summary stats:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    res.status(err.status === 401 ? 401 : 500).json({ error: 'Failed to fetch summary stats' });
  }
};
