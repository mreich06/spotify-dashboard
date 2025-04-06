import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  accessToken: string | null;
}

const initialState: TokenState = {
  accessToken: null,
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
