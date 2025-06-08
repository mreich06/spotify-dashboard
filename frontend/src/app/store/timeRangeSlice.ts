import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

interface TimeRangeState {
  selectedRange: TimeRange;
}

const initialState: TimeRangeState = {
  selectedRange: 'short_term',
};

const timeRangeSlice = createSlice({
  name: 'timeRange',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.selectedRange = action.payload;
    },
  },
});

export const { setTimeRange } = timeRangeSlice.actions;
export default timeRangeSlice.reducer;
