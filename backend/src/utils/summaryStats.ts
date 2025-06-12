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
      const topTracksResponse = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tracks = topTracksResponse.data.items;

      if (!tracks || !Array.isArray(tracks)) {
        summaryData[range] = null;
        continue;
      }

      const totalTracks = tracks.length;
      const totalMinutes = tracks.reduce((sum: number, track: any) => sum + track.duration_ms / 60000, 0);
      const days = range === 'short_term' ? 28 : range === 'medium_term' ? 180 : 730;
      const avgMinutesPerDay = +(totalMinutes / days).toFixed(1);
      const avgPlaysPerDay = +(totalTracks / days).toFixed(1);

      // Collect all artist IDs from the tracks
      const artistIds = [...new Set(tracks.flatMap((track: any) => track.artists.map((artist: any) => artist.id)))];

      // Batch fetch artist details (Spotify API allows 50 at once)
      const artistChunks = [];
      for (let i = 0; i < artistIds.length; i += 50) {
        artistChunks.push(artistIds.slice(i, i + 50));
      }

      const genreCounts: Record<string, number> = {};

      for (const chunk of artistChunks) {
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${chunk.join(',')}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        artistResponse.data.artists.forEach((artist: any) => {
          artist.genres.forEach((genre: string) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        });
      }

      // Convert genreCounts to sorted array
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([genre, count]) => ({ genre, count }));

      summaryData[range] = {
        totalTracks,
        totalMinutes: totalMinutes.toFixed(1),
        avgMinutesPerDay,
        avgPlaysPerDay,
        topGenres,
      };
    }

    res.json(summaryData);
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ error: 'Failed to fetch summary stats' });
  }
};
