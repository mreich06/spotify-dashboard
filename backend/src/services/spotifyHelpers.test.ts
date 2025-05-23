import { getAuthUrl, getTokens } from '../services/spotify';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('get Auth URL', () => {
  // provide env vars to ensure getAuthUrl is using them to cnstruct URL
  process.env.SPOTIFY_CLIENT_ID = 'test_id';
  process.env.SPOTIFY_REDIRECT_URI = 'http://localhost/callback';
  it('should return a valid Spotify OAuth URL', () => {
    const result = getAuthUrl('/dashboard');

    expect(result).toMatch(/^https:\/\/accounts\.spotify\.com\/authorize\?/);
    expect(result).toContain('client_id=test_id');
    expect(result).toContain('redirect_uri=http%3A%2F%2Flocalhost%2Fcallback');
    expect(result).toContain('state=%2Fdashboard');
  });
});

describe('get auth tokens', () => {
  beforeEach(() => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    process.env.SPOTIFY_REDIRECT_URI = 'http://localhost/callback';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should return valid tokens', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 3600,
      },
    });
    const result = await getTokens('test-code');
    expect(result.access_token).toBe('access');
    expect(result.refresh_token).toBe('refresh');
    expect(result.expires_in).toBe(3600);
  });

  it('should return an error if Spotify throws an error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('token error'));
    await expect(getTokens('test-code')).rejects.toThrow('token error');
  });
});
