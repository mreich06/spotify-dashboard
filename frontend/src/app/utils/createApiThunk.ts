import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const createApiThunk = <ReturnType>(type: string, url: string) => {
  return createAsyncThunk(type, async () => {
    try {
      const response = await api.get<ReturnType>(url);
      return response.data;
    } catch (error) {
      console.error(`Request to ${url} failed:`, error);
      throw error;
    }
  });
};
