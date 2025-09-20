import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { SpotifyPlaylistsResponse } from '../types/spotify';

export const fetchTopPlaylists = createApiThunk<SpotifyPlaylistsResponse>('/playlists/fetchTopPlaylists', '/top-playlists');

interface TopPlaylistsState {
  playlists: SpotifyPlaylistsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TopPlaylistsState = {
  playlists: null,
  loading: false,
  error: null,
};

const topPlaylistsSlice = createSlice({
  name: 'topPlaylists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchTopPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch playlists';
      });
  },
});

export default topPlaylistsSlice.reducer;
