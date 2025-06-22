import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { MostStreamedTrackResponse } from '../types/spotify';

export const fetchMostStreamedTrack = createApiThunk<MostStreamedTrackResponse>('/tracks/fetchMostStreamedTrack', '/most-streamed-track');

interface MostStreamedTrackState {
  track: MostStreamedTrackResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: MostStreamedTrackState = {
  track: null,
  loading: false,
  error: null,
};

const mostStreamedTrackSlice = createSlice({
  name: 'mostStreamedTrack',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMostStreamedTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMostStreamedTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.track = action.payload;
      })
      .addCase(fetchMostStreamedTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch track';
      });
  },
});

export default mostStreamedTrackSlice.reducer;
