import axios from 'axios';
import { SpotifyTrackResponse, TimeRange } from '../../types/spotify';

export const fetchUserListeningData = async (
  token: string,
): Promise<{
  topTracksByRange: Record<TimeRange, SpotifyTrackResponse>;
  artistMap: Record<string, { genres: string[]; popularity: number }>;
}> => {
  const timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];

  const topTracksByRange: Record<TimeRange, SpotifyTrackResponse> = {
    short_term: { items: [] },
    medium_term: { items: [] },
    long_term: { items: [] },
  };

  const artistMap: Record<string, { genres: string[]; popularity: number }> = {};

  for (const range of timeRanges) {
    const response = await axios.get<SpotifyTrackResponse>('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: range, limit: 50 },
    });

    topTracksByRange[range] = response.data;

    const tracks = response.data.items;

    const artistIds = [...new Set(tracks.flatMap((track: any) => track.artists.map((a: any) => a.id)))];

    // Batch fetch artist details
    for (let i = 0; i < artistIds.length; i += 50) {
      const batch = artistIds.slice(i, i + 50);
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

      await new Promise((res) => setTimeout(res, 300)); // avoid 429
    }
  }

  return { topTracksByRange, artistMap };
};
