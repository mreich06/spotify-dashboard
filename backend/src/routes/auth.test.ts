import request from 'supertest';
import app from '../app';
import * as spotifyService from '../services/spotify';

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
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress logs

  it('should return 400 if refresh token is missing', async () => {
    const res = await request(app).post('/auth/refresh').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing refresh_token');
  });
});
