import PrismaService from '@common/prisma.service';
import { CreatePostRequest, UpdatePostRequest } from '@dtos/post.dtos';
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

export async function RIsPostWithIdAndUserID(
  id: number,
  userId: number,
): Promise<boolean> {
  return (
    (await PrismaService.post.count({
      where: {
        id: id,
        authorId: userId,
      },
    })) > 0
  );
}

export async function RUpdatePost(
  request: UpdatePostRequest,
): Promise<PostWithAuthor> {
  const result = await PrismaService.post.update({
    where: {
      id: request.id,
      authorId: request.userId,
    },
    data: {
      content: request.content,
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
