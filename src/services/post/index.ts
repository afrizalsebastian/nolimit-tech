import { Logger } from '@common/logger.service';
import {
  AuthorPost,
  CreatePostRequest,
  PostResponse,
  UpdatePostRequest,
} from '@dtos/post.dtos';
import {
  BadRequestError,
  NotFoundError,
} from '@middlewares/errorHandler.middleware';
import { Post, User } from '@prisma/client';
import {
  RCreatePost,
  RGetPostById,
  RIsPostWithIdAndUserID,
  RUpdatePost,
} from '@repositories/post.repositories';
import { validate } from '@utils/dtosValidation.util';
import { PostValidation } from './validation';

function toPostResposne(post: Post, user: User | null = null): PostResponse {
  let author: AuthorPost | undefined;
  if (user) {
    author = {
      name: user.name,
      email: user.email,
      id: user.id,
    };
  }

  return {
    id: post.id,
    content: post.content,
    updatedAt: post.updatedAt,
    author,
  };
}

export async function SCreatePost(
  request: CreatePostRequest,
): Promise<PostResponse> {
  Logger.debug(`services.post.SCreateePost ${request.userId}`);

  const validRequest: CreatePostRequest = validate(
    PostValidation.CREATE,
    request,
  );

  const { post, author } = await RCreatePost(validRequest);
  return toPostResposne(post, author);
}

export async function SGetPostById(id: number): Promise<PostResponse> {
  Logger.debug(`services.post.SGetPostById`);

  if (isNaN(id)) {
    throw new BadRequestError('Path validation error. Only integer accepted');
  }

  const result = await RGetPostById(id);
  if (!result) {
    throw new NotFoundError(`Post with id ${id} not found.`);
  }

  return toPostResposne(result.post, result.author);
}

export async function SUpdatePost(
  request: UpdatePostRequest,
): Promise<PostResponse> {
  Logger.debug(`services.post.SUpdatePost`);

  if (isNaN(request.id)) {
    throw new BadRequestError('Path validation error. Only integer accepted');
  }

  const validRequest: UpdatePostRequest = validate(
    PostValidation.UPDATE,
    request,
  );

  const isPostExist = await RIsPostWithIdAndUserID(
    validRequest.id,
    validRequest.userId,
  );

  if (!isPostExist) {
    throw new NotFoundError(`Post with id ${validRequest.id} not found.`);
  }

  const { post, author } = await RUpdatePost(request);
  return toPostResposne(post, author);
}
