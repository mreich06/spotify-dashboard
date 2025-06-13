import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { GenreTrendsResponse } from '../types/spotify';

export const fetchGenreTrends = createApiThunk<GenreTrendsResponse>('/genres/fetchGenreTrends', '/top-genres-over-time');

const genreTrendsSlice = createSlice({
  name: 'genreTrends',
  initialState: {
    data: null as GenreTrendsResponse | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenreTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGenreTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed';
      });
  },
});

export default genreTrendsSlice.reducer;
