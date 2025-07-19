import rateLimit from 'express-rate-limit';
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { login, me, register } from '../controllers/auth.controller';

const router = Router();

// Define rate limiter: maximum of 10 requests per minute for the /me route
const meRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', meRateLimiter, authenticate, me);

export default router;
