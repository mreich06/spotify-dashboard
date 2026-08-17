import request from 'supertest';
import app from '../app';

import axios from 'axios';
jest.mock('axios');

// mock axios so we don't hit Spotify API
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { fetchSummaryStats } from '../utils/summaryStats';

import * as spotifyUtils from '../utils/spotifyRequest';

// Tests happy paths and error paths for the 5 routes in spotify.ts
// tests summary-stats with mocked handler

// Mock fetchSpotifyData, getAccessToken
jest.mock('../utils/spotifyRequest', () => ({
  ...jest.requireActual('../utils/spotifyRequest'),
  getAccessToken: jest.fn(() => 'mock-token'), // mock token to return 'mock-token'
  fetchSpotifyData: jest.fn(),
  getTimeRangeData: jest.fn(), // safe to noop
}));
const mockedGetAccessToken = spotifyUtils.getAccessToken as jest.Mock;
const mockedFetchSpotifyData = spotifyUtils.fetchSpotifyData as jest.Mock;

// Mock summaryStats
jest.mock('../utils/summaryStats', () => ({
  fetchSummaryStats: jest.fn((_req, res) => res.json({ totalTracks: 123 })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetAccessToken.mockReturnValue('mock-token');
  mockedAxios.get.mockResolvedValue({ data: {} });
  mockedAxios.post.mockResolvedValue({ data: { access_token: 'mock-access-token' } });
});

// /top-artists
describe('GET /top-artists', () => {
  it('calls fetchSpotifyData with correct time_range', async () => {
    mockedFetchSpotifyData.mockImplementation((_endpoint, _req, res) => res.json({ items: [{ id: 'artist1' }] }));

    const res = await request(app).get('/top-artists?time_range=short_term');
    expect(res.status).toBe(200);
    expect(res.body.items[0].id).toBe('artist1');
    expect(mockedFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=short_term', expect.anything(), expect.anything());
  });

  it('defaults to medium_term if no time_range is provided', async () => {
    mockedFetchSpotifyData.mockImplementation((_endpoint, _req, res) => res.json({ items: [{ id: 'artist2' }] }));

    const res = await request(app).get('/top-artists');
    expect(res.status).toBe(200);
    expect(res.body.items[0].id).toBe('artist2');
    expect(mockedFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=medium_term', expect.anything(), expect.anything());
  });

  it('returns 500 if fetchSpotifyData throws', async () => {
    mockedFetchSpotifyData.mockImplementation(() => {
      throw new Error('fail');
    });

    const res = await request(app).get('/top-artists');
    expect(res.status).toBe(500);
  });
});

// /top-tracks
describe('GET /top-tracks', () => {
  it('calls fetchSpotifyData with correct endpoint', async () => {
    mockedFetchSpotifyData.mockImplementation((_endpoint, _req, res) => res.json({ items: [{ id: 'track1' }] }));

    const res = await request(app).get('/top-tracks');
    expect(res.status).toBe(200);
    expect(res.body.items[0].id).toBe('track1');
    expect(mockedFetchSpotifyData).toHaveBeenCalledWith('me/top/tracks', expect.anything(), expect.anything());
  });

  it('returns 500 if fetchSpotifyData fails', async () => {
    mockedFetchSpotifyData.mockImplementation(() => {
      throw new Error('fail');
    });

    const res = await request(app).get('/top-tracks');
    expect(res.status).toBe(500);
  });
});

//
// /playlists
//
describe('GET /playlists', () => {
  it('returns playlists for all time ranges', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { items: [{ id: 'playlist1' }], href: '', limit: 10, total: 1 },
    });

    const res = await request(app).get('/playlists');
    expect(res.status).toBe(200);
    expect(res.body.short_term.items[0].id).toBe('playlist1');
    expect(res.body.medium_term.items[0].id).toBe('playlist1');
    expect(res.body.long_term.items[0].id).toBe('playlist1');
  });

  it('returns 500 if axios.get fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('boom'));

    const res = await request(app).get('/playlists');
    expect(res.status).toBe(500);
  });
});

// /most-streamed-track
describe('GET /most-streamed-track', () => {
  it('enriches tracks with genres and popularity', async () => {
    // Always return tracks for "me/top/tracks"
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('me/top/tracks')) {
        return Promise.resolve({
          data: {
            items: [
              { id: 't1', artists: [{ id: 'a1' }] },
              { id: 't2', artists: [{ id: 'a2' }] },
            ],
          },
        });
      }
      if (url.includes('artists')) {
        return Promise.resolve({
          data: {
            artists: [
              { id: 'a1', genres: ['rock'], popularity: 80 },
              { id: 'a2', genres: ['pop'], popularity: 70 },
            ],
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    const res = await request(app).get('/most-streamed-track');
    expect(res.status).toBe(200);
    // check output JSON of API to confirm code handles data correctly
    expect(res.body.short_term.items[0]).toHaveProperty('genres');
    expect(res.body.short_term.items[0]).toHaveProperty('popularity');
  });
});

// /top-genres-over-time
describe('GET /top-genres-over-time', () => {
  it('returns aggregated genre counts', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('me/top/tracks')) {
        return Promise.resolve({
          data: {
            items: [{ artists: [{ id: 'a1' }, { id: 'a2' }] }, { artists: [{ id: 'a1' }] }],
          },
        });
      }
      if (url.includes('artists')) {
        return Promise.resolve({
          data: {
            artists: [
              { id: 'a1', genres: ['rock'], popularity: 50 },
              { id: 'a2', genres: ['pop'], popularity: 60 },
            ],
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    const res = await request(app).get('/top-genres-over-time');
    expect(res.status).toBe(200);
    expect(res.body.short_term.rock).toBeGreaterThan(0);
    expect(res.body.short_term.pop).toBeGreaterThan(0);
  });
});

// /summary-stats
describe('GET /summary-stats', () => {
  it('returns mocked summary stats', async () => {
    const res = await request(app).get('/summary-stats');
    expect(res.status).toBe(200);
    expect(res.body.totalTracks).toBe(123);
  });
});
