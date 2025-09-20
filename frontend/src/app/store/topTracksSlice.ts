import { createSlice } from '@reduxjs/toolkit';
import type { SpotifyTopTracksResponse, SpotifyTrack } from '../types/spotify';
import { createApiThunk } from '../utils/createApiThunk';

interface TopTracksState {
  topTracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}
const initialState: TopTracksState = {
  topTracks: [],
  loading: false,
  error: null,
};

export const fetchTopTracks = createApiThunk<SpotifyTopTracksResponse>('/tracks/fetchTopTracks', '/top-tracks');

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
        state.topTracks = action.payload.items;
      })
      .addCase(fetchTopTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Could not fetch top tracks';
      });
  },
});

export default topTracksSlice.reducer;
