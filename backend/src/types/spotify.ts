// Spotify types reference - https://developer.spotify.com/documentation/web-api/reference
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

// /users/{user_id}/playlists
// list of all playlists
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

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
}

export interface SpotifyTrack {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    name: string;
  };
  external_urls: { spotify: string };
  id: string;
  genres: string[];
  images: SpotifyImage[];
  name: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  popularity: number;
}

export interface SpotifyTopTracksResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

export interface SpotifyTokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;

  expires_in: number;
  scope: string;
}

export interface SpotifyTrackResponse {
  items: SpotifyTrack[];
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
