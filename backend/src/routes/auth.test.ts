import request from 'supertest';
import app from '../app';
import * as spotifyService from '../services/spotify';
import axios from 'axios';

// Mock the whole spotify service
jest.mock('../services/spotify');
// test /login route
describe('GET /login', () => {
  it('should redirect to Spotify login with default returnTo (/dashboard)', async () => {
    // Mock getAuthUrl to return a fake Spotify login URL
    (spotifyService.getAuthUrl as jest.Mock).mockReturnValue('https://accounts.spotify.com/authorize?state=%2Fdashboard');

    const res = await request(app).get('/auth/login');

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://accounts.spotify.com/authorize?state=%2Fdashboard');
  });
});

describe('/callback', () => {
  it('should return 400 if auth code is missing', async () => {
    const res = await request(app).get('/auth/callback');
    expect(res.status).toBe(400);
    expect(res.text).toContain('Authorization code is missing in callback');
  });

  it('should redirect with token if valid code is given', async () => {
    (spotifyService.getTokens as jest.Mock).mockResolvedValue({
      access_token: 'test-access',
      refresh_token: 'test-refresh',
    });

    // pass test code as query param
    const res = await request(app).get('/auth/callback?code=mock-code&state=/dashboard');
    expect(res.status).toBe(302);

    // should contain mocked access token and refresh token
    expect(res.headers.location).toContain('/dashboard?access_token=test-access&refresh_token=test-refresh');
  });

  it('Should return a 500 error if getTokens throws an error', async () => {
    (spotifyService.getTokens as jest.Mock).mockRejectedValue(new Error('Spotify error'));

    const res = await request(app).get('/auth/callback?code=bad-code&state=/dashboard');
    expect(res.status).toBe(500);
    expect(res.text).toContain('Failed to get access token from Spotify');
  });
});

describe('/refresh', () => {
  it('should return 500 if Spotify returns an error', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Spotify API error'));

    const res = await request(app).post('/auth/refresh').send({ refresh_token: 'invalid_token' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to refresh token');
  });

  it('Should return a new access token if refresh_token is valid', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        access_token: 'test_access_new',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    });
    const res = await request(app).post('/auth/refresh').send({ refresh_token: 'valid_token' });
    expect(res.status).toBe(200);
    expect(res.body.access_token).toBe('test_access_new');
    expect(res.body.token_type).toBe('Bearer');
    expect(res.body.expires_in).toBe(3600);
  });

  it('Should return 500 error if Spotify gives an error', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Spotify error'));

    const res = await request(app).post('/auth/refresh').send({ refresh_token: 'invalid_token' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to refresh token');
  });
});
