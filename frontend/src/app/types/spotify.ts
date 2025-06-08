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
  uri: string;
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
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

export interface SpotifyPlaylistsResponse {
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
