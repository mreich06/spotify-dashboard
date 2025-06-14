import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import artistsReducer from './artistsSlice';
import topTracksReducer from './topTracksSlice';
import playlistsReducer from './playlistsSlice';
import summaryStatsReducer from './summarySlice';
import timeRangeReducer from './timeRangeSlice';
import MostStreamedTrackReducer from './mostStreamedTrackSlice';
import TopArtistsReducer from './topArtistsSlice';
import GenreTrendsReducer from './genreTrendsSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    artists: artistsReducer,
    topTracks: topTracksReducer,
    topPlaylists: playlistsReducer,
    summaryStats: summaryStatsReducer,
    timeRange: timeRangeReducer,
    mostStreamedTrack: MostStreamedTrackReducer,
    topArtists: TopArtistsReducer,
    genreTrends: GenreTrendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
