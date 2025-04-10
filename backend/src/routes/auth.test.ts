import request from 'supertest';
import app from '..';

describe('GET /login', () => {
  it('should redirect to Spotify login', async () => {
    const res = await request(app).get('/auth/login');
    expect(res.status).toBe(302);
    expect(res.header.location).toMatch(/accounts\.spotify\.com/);
  });
});
