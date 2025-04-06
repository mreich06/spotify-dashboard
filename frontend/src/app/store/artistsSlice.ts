import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { SpotifyArtist, SpotifyTopArtistsResponse } from '../types/spotify';

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
export const fetchTopArtists = createAsyncThunk('/artists/fetchTopArtists', async (token: string) => {
  const response = await fetch('http://localhost:4000/top-artists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: SpotifyTopArtistsResponse = await response.json();
  return data.items;
});

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
        state.artists = action.payload;
      })
      .addCase(fetchTopArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch top artists';
      });
  },
});

export default artistsSlice.reducer;
