import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';

type SummaryRange = 'short_term' | 'medium_term' | 'long_term';

export interface GenreStat {
  name: string;
  count: number;
}

export interface SummaryStats {
  totalTracks: number;
  totalMinutes: string;
  avgMinutesPerDay: number;
  avgPlaysPerDay: number;
  genres: GenreStat[];
}

export interface SummaryStatsState {
  loading: boolean;
  error: string | null;
  data: Record<SummaryRange, SummaryStats | null>;
}

const initialState: SummaryStatsState = {
  loading: false,
  error: null,
  data: {
    short_term: null,
    medium_term: null,
    long_term: null,
  },
};

export const fetchSummaryStats = createApiThunk<Record<SummaryRange, SummaryStats>>('/summaryStats/fetchSummaryStats', '/summary-stats');

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
        state.data = action.payload;
      })
      .addCase(fetchSummaryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary stats';
      });
  },
});

export default summaryStatsSlice.reducer;
