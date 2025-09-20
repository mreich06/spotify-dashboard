import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import tokenReducer from '@/app/store/tokenSlice';
import topTracksReducer from '@/app/store/topTracksSlice';
import artistsReducer from '@/app/store/artistsSlice';
import playlistsReducer from '@/app/store/playlistsSlice';

import type { SpotifyTrack, SpotifyArtist, SpotifyPlaylist } from '@/app/types/spotify';

export const renderWithStore = (ui: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      token: tokenReducer,
      topTracks: topTracksReducer,
      artists: artistsReducer,
      playlists: playlistsReducer,
    },
    preloadedState: {
      token: { accessToken: 'mockToken' },

      topTracks: {
        topTracks: [
          {
            id: '1',
            name: 'Mock Track',
            album: {
              id: 'album_1',
              name: 'Mock Album',
              album_type: 'album',
              total_tracks: 1,
              available_markets: [],
              images: [],
              href: '',
              uri: 'spotify:album:mock',
              type: 'album',
              release_date: '',
              release_date_precision: 'day',
              artists: [],
              external_urls: { spotify: '' },
            },
            artists: [
              {
                id: 'artist_1',
                name: 'Mock Artist',
                images: [],
                genres: ['pop'],
                popularity: 75,
                followers: { total: 1000 },
                href: '',
                uri: 'spotify:artist:mockuri',
                type: 'artist',
                external_urls: { spotify: '' },
              } as SpotifyArtist,
            ],
            duration_ms: 200000,
            popularity: 50,
            uri: 'spotify:track:mockuri',
            href: '',
            type: 'track',
            external_urls: { spotify: '' },
            genres: [],
            images: [],
          } as SpotifyTrack,
        ],
        loading: false,
        error: null,
      },

      artists: {
        artists: {
          short_term: [],
          medium_term: [
            {
              id: '1',
              name: 'Mock Artist',
              images: [],
              genres: ['pop'],
              popularity: 75,
              followers: { total: 500 },
              uri: 'spotify:artist:mockuri',
              href: '',
              type: 'artist',
              external_urls: { spotify: '' },
            } as SpotifyArtist,
          ],
          long_term: [],
        },
        loading: false,
        error: null,
      },

      playlists: {
        playlists: {
          short_term: {
            href: 'https://api.spotify.com/v1/me/playlists',
            limit: 1,
            total: 1,
            items: [
              {
                id: 'playlist_1',
                href: 'https://api.spotify.com/v1/playlists/playlist_1',
                name: 'Mock Playlist',
                images: [],
                tracks: {
                  href: 'https://api.spotify.com/v1/playlists/playlist_1/tracks',
                  total: 10,
                },
                uri: 'spotify:playlist:mockuri',
                type: 'playlist',
                external_urls: { spotify: '' },
              } as SpotifyPlaylist,
            ],
          },
          medium_term: { href: '', limit: 0, total: 0, items: [] },
          long_term: { href: '', limit: 0, total: 0, items: [] },
        },
        loading: false,
        error: null,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};
