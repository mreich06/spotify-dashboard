import { createSlice } from '@reduxjs/toolkit';
import { SpotifyPlaylistsResponse } from '../types/spotify';
import { createApiThunk } from '../utils/createApiThunk';

interface PlaylistsState {
  playlists: SpotifyPlaylistsResponse;
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistsState = {
  playlists: { href: '', limit: 0, total: 0, items: [] },
  loading: false,
  error: null,
};

export const fetchPlaylists = createApiThunk<SpotifyPlaylistsResponse>(
  '/playlists/fetchPlaylists',
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlists`,
);

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Could not fetch playlists';
      });
  },
});

export default playlistsSlice.reducer;
