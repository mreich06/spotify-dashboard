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

export interface SpotifyTokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;

  expires_in: number;
  scope: string;
}
