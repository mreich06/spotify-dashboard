import artistsReducer, { fetchTopArtists } from '../artistsSlice';
import type { ArtistsState } from '../artistsSlice';
import type { SpotifyArtist } from '@/app/types/spotify';

describe('artistsSlice', () => {
  const initialState: ArtistsState = {
    artists: {
      short_term: [],
      medium_term: [],
      long_term: [],
    },
    loading: false,
    error: null,
  };

  const mockArtist: SpotifyArtist = {
    id: '1',
    name: 'Test Artist',
    genres: ['rock'],
    images: [],
    popularity: 80,
    uri: 'spotify:artist:1',
  };

  it('returns initial state', () => {
    const state = artistsReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchTopArtists.pending', () => {
    const action = { type: fetchTopArtists.pending.type };
    const state = artistsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchTopArtists.fulfilled (medium_term)', () => {
    const fulfilledAction = {
      type: fetchTopArtists.fulfilled.type,
      payload: { items: [mockArtist] },
      meta: { arg: { query: { time_range: 'medium_term' } } },
    };
    const state = artistsReducer(initialState, fulfilledAction);
    expect(state.loading).toBe(false);
    expect(state.artists.medium_term).toEqual([mockArtist]);
  });

  it('handles fetchTopArtists.rejected', () => {
    const rejectedAction = {
      type: fetchTopArtists.rejected.type,
      error: { message: 'API Error' },
    };
    const state = artistsReducer(initialState, rejectedAction);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('API Error');
  });
});
