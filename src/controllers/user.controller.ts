import { CreateUserRequest } from '@dtos/user.dtos';
import { BadRequestError } from '@middlewares/errorHandler.middleware';
import { CreateUser } from '@services/user';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export async function Register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as CreateUserRequest;
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
