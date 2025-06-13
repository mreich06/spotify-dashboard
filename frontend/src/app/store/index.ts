import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import artistsReducer from './artistsSlice';
import topTracksReducer from './topTracksSlice';
import playlistsReducer from './playlistsSlice';
import summaryStatsReducer from './summarySlice';
import timeRangeReducer from './timeRangeSlice';
import MostStreamedTrackReducer from './mostStreamedTrackSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    artists: artistsReducer,
    topTracks: topTracksReducer,
    playlists: playlistsReducer,
    summaryStats: summaryStatsReducer,
    timeRange: timeRangeReducer,
    mostStreamedTrack: MostStreamedTrackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
