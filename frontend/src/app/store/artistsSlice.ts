import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { SpotifyArtist, SpotifyTopArtistsResponse, SpotifyTopTracksResponse } from '../types/spotify';
import api from '@/lib/api';
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
export const fetchTopArtists = createAsyncThunk('/artists/fetchTopArtists', async () => {
  const response = await api.get('http://localhost:4000/top-artists');
  const data: SpotifyTopArtistsResponse = await response.data;
  return data.items;
});
export const fetchTopTracks = createApiThunk<SpotifyTopTracksResponse>('/tracks/fetchTopTracks', 'http://localhost:4000/top-tracks');

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
