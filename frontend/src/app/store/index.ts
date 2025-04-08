import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import artistsReducer from './artistsSlice';
import topTracksReducer from './topTracksSlice';
import playlistsReducer from './playlistsSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    artists: artistsReducer,
    topTracks: topTracksReducer,
    playlists: playlistsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
