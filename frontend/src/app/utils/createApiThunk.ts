import { createAsyncThunk } from '@reduxjs/toolkit';

export const createApiThunk = <ReturnType>(type: string, url: string) => {
  return createAsyncThunk(type, async (token: string) => {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`Request failed: ${response.statusText}`);
    }

    const data: ReturnType = await response.json();
    return data;
  });
};
