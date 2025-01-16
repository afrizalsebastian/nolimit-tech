import { LoginRequest, RegisterRequest } from '@dtos/user.dtos';
import {
  BadRequestError,
  UnauthorizedError,
} from '@middlewares/errorHandler.middleware';
import { CreateUser, UserLogin } from '@services/user';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';

export async function Register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as RegisterRequest;
    const result = await CreateUser(body);

    res.status(201).json({
      status: true,
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const valErr = new BadRequestError('Validation Error.');
      next(valErr);
    }
    next(err);
  }
}

export async function Login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as LoginRequest;
    const token = await UserLogin(body);

    res.status(200).json({
      status: true,
      data: {
        token,
      },
    });
  } catch (err) {
    let errorValue = err;
    if (err instanceof ZodError) {
      errorValue = new BadRequestError('Validation Error.');
    } else if (err instanceof JsonWebTokenError) {
      errorValue = new UnauthorizedError('Token Invalid');
    } else if (err instanceof TokenExpiredError) {
      errorValue = new UnauthorizedError('Token Expired.');
    }
    next(errorValue);
  }
}
