import axios from 'axios';
import type { Request, Response } from 'express';
export const fetchSpotifyData = async <T>(endpoint: string, req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).send('Access token is missing');
  }

  try {
    const response = await axios.get<T>(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching ${endpoint}}:`, error);
    res.status(500).send(`Failed to fetch ${endpoint}`);
  }
};
