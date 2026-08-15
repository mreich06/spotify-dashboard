import playlistsReducer, { fetchTopPlaylists } from '../playlistsSlice';
import { TopPlaylistsState } from '../playlistsSlice';
import type { SpotifyPlaylistsResponse } from '@/app/types/spotify';

describe('playlistsSlice', () => {
  const initialState: TopPlaylistsState = {
    playlists: null,
    loading: false,
    error: null,
  };

  const mockResponse: SpotifyPlaylistsResponse = {
    short_term: {
      href: 'https://api.spotify.com/v1/users/user_id/playlists',
      limit: 1,
      total: 1,
      items: [
        {
          id: 'playlist_1',
          name: 'Mock Playlist',
          href: 'https://api.spotify.com/v1/playlists/playlist_1',
          images: [],
          tracks: {
            href: 'https://api.spotify.com/v1/playlists/playlist_1/tracks',
            total: 10,
          },
        },
      ],
    },
    medium_term: { href: '', limit: 0, total: 0, items: [] },
    long_term: { href: '', limit: 0, total: 0, items: [] },
  };

  it('returns initial state', () => {
    const state = playlistsReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchPlaylists.pending', () => {
    const action = { type: fetchTopPlaylists.pending.type };
    const state = playlistsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchPlaylists.fulfilled', () => {
    const fulfilledAction = {
      type: fetchTopPlaylists.fulfilled.type,
      payload: mockResponse,
    };
    const state = playlistsReducer(initialState, fulfilledAction);
    expect(state.loading).toBe(false);
    expect(state.playlists).toEqual(mockResponse);
  });

  it('handles fetchPlaylists.rejected', () => {
    const rejectedAction = {
      type: fetchTopPlaylists.rejected.type,
      error: { message: 'Network error' },
    };
    const state = playlistsReducer(initialState, rejectedAction);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});
