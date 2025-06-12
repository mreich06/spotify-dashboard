import type { Request, Response } from 'express';
import axios from 'axios';

export const fetchSummaryStats = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  const timeRanges = ['short_term', 'medium_term', 'long_term'] as const;
  const summaryData: Record<string, any> = {};

  try {
    for (const range of timeRanges) {
      const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!data.items || !Array.isArray(data.items)) {
        summaryData[range] = null;
        continue;
      }

      const totalTracks = data.items.length;
      const totalMinutes = data.items.reduce((sum: number, track: any) => sum + track.duration_ms / 60000, 0);

      const days = range === 'short_term' ? 28 : range === 'medium_term' ? 180 : 730;
      const avgMinutesPerDay = +(totalMinutes / days).toFixed(1);
      const avgPlaysPerDay = +(totalTracks / days).toFixed(1);

      // Collect unique artist IDs from tracks
      const artistIds = Array.from(new Set(data.items.flatMap((track: any) => track.artists.map((artist: any) => artist.id)))).slice(0, 50); // limit to 50 for batch API

      let genres: { name: string; count: number }[] = [];

      if (artistIds.length > 0) {
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const genreMap: Record<string, number> = {};
        artistResponse.data.artists.forEach((artist: any) => {
          artist.genres.forEach((genre: string) => {
            genreMap[genre] = (genreMap[genre] || 0) + 1;
          });
        });

        // get top 5 genres
        genres = Object.entries(genreMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      summaryData[range] = {
        totalTracks,
        totalMinutes: totalMinutes.toFixed(1),
        avgMinutesPerDay,
        avgPlaysPerDay,
        genres,
      };
    }

    res.json(summaryData);
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ error: 'Failed to fetch summary stats' });
  }
};
