import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import artistsReducer from './artistsSlice';
import topTracksReducer from './topTracksSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    artists: artistsReducer,
    topTracks: topTracksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
