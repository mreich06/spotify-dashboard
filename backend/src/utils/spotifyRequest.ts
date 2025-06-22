import axios from 'axios';
import type { Request, Response } from 'express';
import { TimeRange } from '../../types/spotify';
import querystring from 'querystring';

type Handler<T> = (data: T, req: Request, res: Response) => Promise<void>;

const fetchWithRetry = async <T>(endpoint: string, token: string, retries = 2): Promise<T> => {
  try {
    const response = await axios.get<T>(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 429 && retries > 0) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10) * 1000;
      await new Promise((resolve) => setTimeout(resolve, retryAfter));
      return fetchWithRetry<T>(endpoint, token, retries - 1);
    }
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const encodedAuth = Buffer.from(authString).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data; // contains access_token and expires_in
  } catch (err: unknown) {
    const error = err as any; // or use a custom error type
    console.error('Error refreshing access token:', error.response?.data || error.message);
  }
};
export const fetchWithRefresh = async <T>(token: string, refreshToken: string, url: string, params = {}) => {
  try {
    const res = await axios.get<T>(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Token expired, try refreshing
      const refreshed = await refreshAccessToken(refreshToken); // implement this
      const res = await axios.get<T>(url, {
        headers: { Authorization: `Bearer ${refreshed.access_token}` },
        params,
      });
      return res.data;
    } else {
      throw err;
    }
  }
};

export const fetchSpotifyData = async <T>(endpoint: string, req: Request, res: Response, customHandler?: Handler<T>): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('Access token:', token);

  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  try {
    const data = await fetchWithRetry<T>(endpoint, token);
    if (customHandler) {
      await customHandler(data, req, res);
    } else {
      console.log('response.data', data, 'endpoint is', endpoint);
      res.json(data);
    }
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: `Failed to fetch ${endpoint}` });
  }
};

export const batchFetchArtists = async (artistIds: string[], token: string): Promise<any[]> => {
  const batches = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    const batch = artistIds.slice(i, i + 50);
    try {
      const response = await fetchWithRetry<{ artists: any[] }>(`artists?ids=${batch.join(',')}`, token);
      batches.push(...response.artists);
    } catch (err) {
      console.error('Error fetching batch:', batch, err);
    }
  }
  return batches;
};

export const getAccessToken = (req: any) => {
  return req.headers.authorization?.replace('Bearer ', '');
};

export const createEmptyTimeRangeResult = <T>(defaultValue: T): Record<TimeRange, T> => {
  return {
    short_term: defaultValue,
    medium_term: defaultValue,
    long_term: defaultValue,
  };
};

export const timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];

export const getTimeRangeData = (token: any, res: Response) => {
  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }
};
