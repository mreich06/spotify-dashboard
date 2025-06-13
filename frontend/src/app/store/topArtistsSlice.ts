import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { SpotifyArtist, SpotifyTopArtistsResponse } from '../types/spotify';

export const fetchTopArtists = createApiThunk<SpotifyTopArtistsResponse>('/artists/fetchTopArtists', '/top-artists');

interface TopArtistsState {
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}

const initialState: TopArtistsState = {
  artists: [],
  loading: false,
  error: null,
};

const topArtistsSlice = createSlice({
  name: 'topArtists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopArtists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload.items;
      })
      .addCase(fetchTopArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch top artists';
      });
  },
});

export default topArtistsSlice.reducer;
