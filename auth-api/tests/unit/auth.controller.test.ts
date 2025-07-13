import { Request, Response } from 'express';
import { register } from '../../src/controllers/auth.controller';

jest.mock('../../db/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}));

import prisma from '../../db/prisma';

describe('register', () => {
  it('should return 400 if email already exists', async () => {
    const req = {
      body: {
        email: 'existing@test.com',
        username: 'testuser',
        password: '123456'
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
  });
});