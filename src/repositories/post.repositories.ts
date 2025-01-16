import PrismaService from '@common/prisma.service';
import { CreatePostRequest } from '@dtos/post.dtos';
import { Post, User } from '@prisma/client';

export interface PostWithAuthor {
  post: Post;
  author: User | null;
}

export async function RCreatePost(
  request: CreatePostRequest,
): Promise<PostWithAuthor> {
  const result = await PrismaService.post.create({
    data: {
      content: request.content,
      authorId: request.userId,
    },
    include: {
      Author: true,
    },
  });

  return {
    post: result,
    author: result.Author,
  };
}

export async function RGetPostById(id: number): Promise<PostWithAuthor | null> {
  const result = await PrismaService.post.findFirst({
    where: {
      id: id,
    },
    include: {
      Author: true,
    },
  });

  if (!result) return null;
  return {
    post: result,
    author: result.Author,
  };
}
