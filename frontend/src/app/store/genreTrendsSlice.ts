import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../utils/createApiThunk';
import { GenreTrendsResponse } from '../types/spotify';

export const fetchGenreTrends = createApiThunk<GenreTrendsResponse>('/genres/fetchGenreTrends', '/top-genres-over-time');

interface GenreTrendsState {
  data: GenreTrendsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: GenreTrendsState = {
  data: null,
  loading: false,
  error: null,
};

const genreTrendsSlice = createSlice({
  name: 'genreTrends',
  initialState,
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
        console.log('genre action.payload', action.payload);
      })
      .addCase(fetchGenreTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed';
      });
  },
});

export default genreTrendsSlice.reducer;
