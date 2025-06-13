import axios from 'axios';
import type { Request, Response } from 'express';

type Handler<T> = (data: T, req: Request, res: Response) => Promise<void>;

export const fetchSpotifyData = async <T>(endpoint: string, req: Request, res: Response, customHandler?: Handler<T>): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  try {
    const response = await axios.get<T>(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (customHandler) {
      await customHandler(response.data, req, res);
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    res.status(500).json({ error: `Failed to fetch ${endpoint}` });
  }
};
