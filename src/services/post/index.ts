import { Logger } from '@common/logger.service';
import { AuthorPost, CreatePostRequest, PostResponse } from '@dtos/post.dtos';
import { Post, User } from '@prisma/client';
import { RCreatePost } from '@repositories/post.repositories';
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
