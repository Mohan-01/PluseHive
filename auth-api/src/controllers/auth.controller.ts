import { Request, Response } from 'express';
import prisma from '../../db/prisma';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { log } from '../utils/log';

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    log.info(`Register attempt for email: ${email}`);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      log.warn(`Email already registered: ${email}`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const token = generateToken(user.id);
    log.info(`User registered successfully: ${user.id}`);

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    log.error(err as string | Error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    // console.time("Total Login");

    const { email, password } = req.body;
    log.info(`Login attempt for email: ${email}`);

    // console.time("DB Query");
    const user = await prisma.user.findUnique({ where: { email } });
    // console.timeEnd("DB Query");

    if (!user) {
      log.warn(`Invalid login - user not found: ${email}`);
      // console.timeEnd("Total Login");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // console.time("Password Compare");
    const isValid = await comparePasswords(password, user.passwordHash);
    // console.timeEnd("Password Compare");

    if (!isValid) {
      log.warn(`Invalid login - wrong password: ${email}`);
      // console.timeEnd("Total Login");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // console.time("JWT Generation");
    const token = generateToken(user.id);
    // console.timeEnd("JWT Generation");

    log.info(`User logged in: ${user.id}`);

    // console.timeEnd("Total Login");
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    log.error(err as string | Error);
    // console.timeEnd("Total Login");
    res.status(500).json({ error: 'Login failed' });
  }
}


export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    log.debug(`Fetching user profile for ID: ${userId}`);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      log.warn(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    log.error(err as string | Error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
