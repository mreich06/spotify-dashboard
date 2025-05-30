import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import tokenReducer from '@/app/store/tokenSlice';
import topTracksReducer from '@/app/store/topTracksSlice';
import artistsReducer from '@/app/store/artistsSlice';
import playlistsReducer from '@/app/store/playlistsSlice';
import { render } from '@testing-library/react';
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
            images: [],
            artists: [],
            popularity: 50,
            genres: [],
            uri: 'spotify:track:mockuri',
          },
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
              uri: 'spotify:artist:mockuri',
            },
          ],
          long_term: [],
        },
        loading: false,
        error: null,
      },

      playlists: {
        playlists: {
          href: 'https://api.spotify.com/v1/me/playlists',
          limit: 1,
          total: 1,
          items: [
            {
              id: 'playlist_1',
              href: 'https://api.spotify.com/v1/playlists/playlist_1',
              name: 'Mock Playlist',
              images: [], // Or mock: [{ url: "https://...", width: 300, height: 300 }]
              tracks: {
                href: 'https://api.spotify.com/v1/playlists/playlist_1/tracks',
                total: 10,
              },
            },
          ],
        },
        loading: false,
        error: null,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};
