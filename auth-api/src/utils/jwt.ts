import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import ms from 'ms';

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const JWT_SECRET = getEnvOrThrow('JWT_SECRET');
const JWT_ALGORITHM = getEnvOrThrow('JWT_ALGORITHM') as jwt.Algorithm;
const JWT_ISSUER = getEnvOrThrow('JWT_ISSUER');
const JWT_AUDIENCE = getEnvOrThrow('JWT_AUDIENCE');
const JWT_EXPIRES_IN = getEnvOrThrow('JWT_EXPIRES_IN') as ms.StringValue;


const signOptions: SignOptions = {
  algorithm: JWT_ALGORITHM,
  expiresIn: JWT_EXPIRES_IN,
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, signOptions);
};

const verifyOptions: VerifyOptions = {
  algorithms: [JWT_ALGORITHM],
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, JWT_SECRET, verifyOptions) as { userId: number };
};
