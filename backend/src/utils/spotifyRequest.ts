import axios from 'axios';
import type { Request, Response } from 'express';
import { TimeRange } from '../types/spotify';
import querystring from 'querystring';

/**
 * Spotify Web API request helpers.
 *
 * External Use:
 * - fetchSpotifyData: Fetches a Spotify endpoint, handles token + optional custom handler
 * - batchFetchArtists: Gets artist data in batches of 50 IDs
 * - getAccessToken: Extracts bearer token from request headers
 * - createEmptyTimeRangeResult: Builds { short_term, medium_term, long_term } with defaults
 * - timeRanges: Supported Spotify time ranges
 * - getTimeRangeData: Sends 401 if access token is missing
 */

// Type for custom handlers in routes
type Handler<T> = (data: T, req: Request, res: Response) => Promise<void>;

/**
 * Refresh an access token using the refresh token.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const encodedAuth = Buffer.from(authString).toString('base64');

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
};

/**
 * Fetcher that handles both 401 (expired token) and 429 (rate limit)
 */
export const fetchSpotify = async <T>(url: string, accessToken: string, refreshToken: string, params = {}, retries = 2): Promise<T> => {
  try {
    const res = await axios.get<T>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
    });
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;

    // Handle rate limiting
    if (status === 429 && retries > 0) {
      const retryAfter = parseInt(err.response.headers['retry-after'] || '1', 10) * 1000;
      console.warn(`Rate limited. Retrying after ${retryAfter} ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryAfter));
      return fetchSpotify<T>(url, accessToken, refreshToken, params, retries - 1);
    }

    // Handle expired token
    if (status === 401 && refreshToken) {
      console.warn('Access token expired. Refreshing...');
      const refreshed = await refreshAccessToken(refreshToken);
      const res = await axios.get<T>(url, {
        headers: { Authorization: `Bearer ${refreshed.access_token}` },
        params,
      });
      return res.data;
    }

    throw err;
  }
};

/**
 * Route helper: wrap fetchSpotify for use inside Express routes.
 */
export const fetchSpotifyData = async <T>(endpoint: string, req: Request, res: Response, customHandler?: Handler<T>): Promise<void> => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'] as string;

  if (!accessToken || !refreshToken) {
    res.status(401).json({ error: 'Access or refresh token is missing' });
    return;
  }

  try {
    const url = `https://api.spotify.com/v1/${endpoint}`;
    const data = await fetchSpotify<T>(url, accessToken, refreshToken);

    if (customHandler) {
      await customHandler(data, req, res);
    } else {
      res.json(data);
    }
  } catch (error: any) {
    console.error(`Failed to fetch ${endpoint}`, error.message);
    res.status(500).json({ error: `Failed to fetch ${endpoint}` });
  }
};

export const getAccessToken = (req: Request) => req.headers.authorization?.replace('Bearer ', '');

export const createEmptyTimeRangeResult = <T>(defaultValue: T): Record<TimeRange, T> => ({
  short_term: defaultValue,
  medium_term: defaultValue,
  long_term: defaultValue,
});

export const timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];

export const getTimeRangeData = (token: string | undefined, res: Response) => {
  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
  }
};
