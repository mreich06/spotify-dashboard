import topTracksReducer, { fetchTopTracks } from '../topTracksSlice';
import type { TopTracksState } from '../topTracksSlice';
import type { SpotifyTopTracksResponse, SpotifyArtist } from '@/app/types/spotify';

describe('topTracksSlice', () => {
  const initialState: TopTracksState = {
    topTracks: [],
    loading: false,
    error: null,
  };

  const mockArtist: SpotifyArtist = {
    id: '1',
    name: 'Test Track',
    genres: ['pop'],
    images: [],
    popularity: 80,
    uri: 'spotify:track:1',
  };

  const mockResponse: SpotifyTopTracksResponse = {
    href: 'https://api.spotify.com/v1/me/top/tracks',
    limit: 1,
    next: null,
    offset: 0,
    previous: null,
    total: 1,
    items: [mockArtist],
  };

  it('returns the initial state', () => {
    const state = topTracksReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchTopTracks.pending', () => {
    const action = { type: fetchTopTracks.pending.type };
    const state = topTracksReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchTopTracks.fulfilled', () => {
    const fulfilledAction = {
      type: fetchTopTracks.fulfilled.type,
      payload: mockResponse,
    };
    const state = topTracksReducer(initialState, fulfilledAction);
    expect(state.loading).toBe(false);
    expect(state.topTracks).toEqual([mockArtist]);
  });

  it('handles fetchTopTracks.rejected', () => {
    const rejectedAction = {
      type: fetchTopTracks.rejected.type,
      error: { message: 'API Error' },
    };
    const state = topTracksReducer(initialState, rejectedAction);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('API Error');
  });
});
