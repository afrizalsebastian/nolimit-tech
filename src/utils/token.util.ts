import { UnauthorizedError } from '@middlewares/errorHandler.middleware';
import dotnev from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotnev.config();

export interface ClaimsPayload {
  id: number;
  name: string;
  email: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

export function CreateToken(payload: ClaimsPayload): string {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

function extractToken(auth: string) {
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '');
  }

  throw new UnauthorizedError();
}

export function VerifyToken(auth: string): ClaimsPayload {
  const token = extractToken(auth);
  return jwt.verify(token, JWT_SECRET_KEY) as ClaimsPayload;
}
