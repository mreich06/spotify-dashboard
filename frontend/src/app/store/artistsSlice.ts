import { createSlice } from '@reduxjs/toolkit';
import type { SpotifyArtist, SpotifyTopArtistsResponse, SpotifyTopTracksResponse } from '../types/spotify';
import { createApiThunk } from '../utils/createApiThunk';
interface ArtistsState {
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}

const initialState: ArtistsState = {
  artists: [],
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
        state.artists = action.payload.items;
      })
      .addCase(fetchTopArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch top artists';
      });
  },
});

export default artistsSlice.reducer;
