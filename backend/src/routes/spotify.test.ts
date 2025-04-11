// Tests for checking that server routes call fetchSpotifyData correctly

import request from 'supertest';
import app from '../app';
import * as spotifyUtils from '../utils/spotifyRequest';

jest.mock('../utils/spotifyRequest');
const mockFetchSpotifyData = spotifyUtils.fetchSpotifyData as jest.Mock;

beforeEach(() => {
  mockFetchSpotifyData.mockImplementation((_endpoint, _req, res) => {
    res.status(200).json({ message: 'mocked' }); // simulate sending response
  });
});
// Test that we are calling fetchSpotifyData with /me/top-artists with time range added when we have GET request to /top-artists
describe('GET /top-artists', () => {
  it('calls fetchSpotifyData with correct time_range', async () => {
    await request(app).get('/top-artists?time_range=short_term');
    expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=short_term', expect.anything(), expect.anything());
  });

  // default time range should be medium
  it('calls fetchSpotifyData with medium_term time_range', async () => {
    await request(app).get('/top-artists');
    expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=medium_term', expect.anything(), expect.anything());
  });
});

// Test that we are calling fetchSpotifyData with /me/top/tracks when we have GET request to /top-tracks
describe('GET /top-tracks', () => {
  it('calls fetchSpotifyData with correct endpoint', async () => {
    await request(app).get('/top-tracks');
    expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/tracks', expect.anything(), expect.anything());
  });
});

// Test that we are calling fetchSpotifyData with /me/top/playlists when we have GET request to /playlists
describe('GET /playlists', () => {
  it('calls fetchSpotifyData with correct endpoint', async () => {
    await request(app).get('/playlists');
    expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/playlists', expect.anything(), expect.anything());
  });
});
