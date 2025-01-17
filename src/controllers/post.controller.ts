import {
  CreatePostRequest,
  DeletePostRequest,
  UpdatePostRequest,
} from '@dtos/post.dtos';
import { AuthenticatedRequest } from '@middlewares/auth.middleware';
import { BadRequestError } from '@middlewares/errorHandler.middleware';
import {
  SCreatePost,
  SDeletePost,
  SGetPostById,
  SUpdatePost,
} from '@services/post';
import { NextFunction, Request, Response } from 'express';
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

export async function GetPostById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const result = await SGetPostById(id);

    res.status(200).json({
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

export async function UpdatePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const body = req.body as UpdatePostRequest;
    const user = req.user;

    body.id = id;
    body.userId = user!.id;

    const result = await SUpdatePost(body);
    res.status(200).json({
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

export async function DeletePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;
    const request: DeletePostRequest = {
      id,
      userId,
    };

    const result = await SDeletePost(request);
    res.status(200).json({
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
