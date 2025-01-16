import { ClaimsPayload, VerifyToken } from '@utils/token.util';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.middleware';

export interface AuthenticatedRequest extends Request {
  user?: ClaimsPayload;
}

const AuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Access denied. Token missing');
    }

    const claims = VerifyToken(authHeader);
    req.user = claims;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      const newErr = new UnauthorizedError('Invalid Token');
      next(newErr);
    }

    if (err instanceof TokenExpiredError) {
      const newErr = new UnauthorizedError('Token Expired');
      next(newErr);
    }

    next(err);
  }
};

export default AuthMiddleware;
