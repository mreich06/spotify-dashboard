import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { SummaryStatsResponse } from '../types/spotify';

interface SummaryStatsState {
  stats: SummaryStatsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: SummaryStatsState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchSummaryStats = createApiThunk<SummaryStatsResponse>('/summaryStats/fetchSummaryStats', '/summary-stats');

const summaryStatsSlice = createSlice({
  name: 'summaryStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaryStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummaryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        console.log('action.payload', action.payload);
      })
      .addCase(fetchSummaryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary stats';
      });
  },
});

export default summaryStatsSlice.reducer;
