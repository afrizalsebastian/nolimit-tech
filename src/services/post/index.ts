import { Logger } from '@common/logger.service';
import { AuthorPost, CreatePostRequest, PostResponse } from '@dtos/post.dtos';
import {
  BadRequestError,
  NotFoundError,
} from '@middlewares/errorHandler.middleware';
import { Post, User } from '@prisma/client';
import { RCreatePost, RGetPostById } from '@repositories/post.repositories';
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

export async function SGetPostById(id: string): Promise<PostResponse> {
  Logger.debug(`services.post.SGetPostById`);

  const intId = parseInt(id);
  if (isNaN(intId)) {
    throw new BadRequestError('Path validation error. Only integer accepted');
  }

  const result = await RGetPostById(intId);
  if (!result) {
    throw new NotFoundError(`Post with id ${intId} not found.`);
  }

  return toPostResposne(result.post, result.author);
}
