import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const createApiThunk = <ReturnType>(type: string, url: string) => {
  return createAsyncThunk(type, async (params?: { query?: Record<string, string> }) => {
    try {
      const queryString = params?.query ? '?' + new URLSearchParams(params.query).toString() : '';
      const response = await api.get<ReturnType>(`${url}${queryString}`);
      return response.data;
    } catch (error) {
      console.error(`Request to ${url} failed:`, error);
      throw error;
    }
  });
};
