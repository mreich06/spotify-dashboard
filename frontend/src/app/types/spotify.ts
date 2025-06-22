export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}
export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
}

export interface SpotifyTopTracksResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyArtist[];
}

export interface SpotifyPlaylists {
  href: string;
  limit: number;
  total: number;
  items: SpotifyPlaylist[];
}

export interface SpotifyPlaylist {
  id: string;
  href: string;
  images: SpotifyImage[];
  name: string;
  tracks: {
    href: string;
    total: number;
  };
}
export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyTrack {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    images: SpotifyImage[];
    name: string;
  };
  artists: { id: string; name: string }[];
  external_urls: { spotify: string };
  id: string;
  genres: string[];
  images: SpotifyImage[];
  name: string;
  duration_ms: number;
  popularity: number;
}

export interface SpotifyTrackResponse {
  items: SpotifyTrack[];
}

export interface GenreTrendMap {
  [genre: string]: number;
}

export interface CardProps {
  timeRange: 'short_term' | 'medium_term' | 'long_term';
}

export interface GenreStat {
  name: string;
  count: number;
}

export interface SummaryStats {
  totalTracks: number;
  totalMinutes: string;
  avgMinutesPerDay: number;
  avgPlaysPerDay: number;
  genres: GenreStat[];
}
export type MostStreamedTrackResponse = Record<TimeRange, SpotifyTrackResponse>;

export type SpotifyPlaylistsResponse = Record<TimeRange, SpotifyPlaylists>;

export type SummaryStatsResponse = Record<TimeRange, SummaryStats>;

export type TimeRangeRecord<T> = Record<TimeRange, T>;

export type GenreTrendsResponse = Record<TimeRange, GenreTrendMap>;
