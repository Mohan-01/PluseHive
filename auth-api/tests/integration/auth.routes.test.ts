import request from 'supertest';
import app from '../../src/app';

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: `test${Date.now()}@test.com`,
      username: 'testuser',
      password: 'testpass'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toContain('@');
  });
});
