import { createSlice } from '@reduxjs/toolkit';
import type { SpotifyArtist, SpotifyTopArtistsResponse } from '../types/spotify';
import { createApiThunk } from '../utils/createApiThunk';
interface ArtistsState {
  artists: {
    short_term: SpotifyArtist[];
    medium_term: SpotifyArtist[];
    long_term: SpotifyArtist[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: ArtistsState = {
  artists: {
    short_term: [],
    medium_term: [],
    long_term: [],
  },
  loading: false,
  error: null,
};

// Thunk to create artists
export const fetchTopArtists = createApiThunk<SpotifyTopArtistsResponse>('artists/fetchTopArtists', '/top-artists');

const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopArtists.fulfilled, (state, action) => {
        state.loading = false;
        // action.meta.arg is arg passed when dispatching thunk
        // ex- dispatch(fetchTopArtists({ query: { time_range: 'short_term' } }))
        const timeRange = action.meta.arg?.query?.time_range || 'medium_term';
        // dynamically set correct key in artist object
        state.artists[timeRange as keyof typeof state.artists] = action.payload.items;
      })
      .addCase(fetchTopArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch top artists';
      });
  },
});

export default artistsSlice.reducer;
