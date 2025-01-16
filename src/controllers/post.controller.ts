import { CreatePostRequest } from '@dtos/post.dtos';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { BadRequestError } from '@middlewares/errorHandler.middleware';
import { SCreatePost } from '@services/post';
import { NextFunction, Response } from 'express';
import { ZodError } from 'zod';

export async function CreatePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as CreatePostRequest;
    body.userId = req.user!.id;
    const result = await SCreatePost(body);

    res.status(201).json({
      status: true,
      data: result,
    });
  } catch (err) {
    let errorValue = err;
    if (err instanceof ZodError) {
      errorValue = new BadRequestError('Validation Error.');
    }
    next(errorValue);
  }
}
