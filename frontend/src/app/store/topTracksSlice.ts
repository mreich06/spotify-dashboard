import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { SpotifyArtist, SpotifyTopTracksResponse } from '../types/spotify';

interface TopTracksState {
  topTracks: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}
const initialState: TopTracksState = {
  topTracks: [],
  loading: false,
  error: null,
};

export const fetchTopTracks = createAsyncThunk('/tracks/fetchTopTracks', async (token: string) => {
  const response = await fetch('http://localhost:4000/top-tracks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: SpotifyTopTracksResponse = await response.json();
  return data.items;
});

const topTracksSlice = createSlice({
  name: 'top-tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.topTracks = action.payload;
      })
      .addCase(fetchTopTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Could not fetch top tracks';
      });
  },
});

export default topTracksSlice.reducer;
