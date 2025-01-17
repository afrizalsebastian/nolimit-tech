import PrismaService from '@common/prisma.service';
import {
  CreatePostRequest,
  DeletePostRequest,
  UpdatePostRequest,
} from '@dtos/post.dtos';
import { Post, User } from '@prisma/client';
import { PostQuery } from '@utils/queryPost.util';

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

export async function RGetPostCount(query: PostQuery): Promise<number> {
  return await PrismaService.post.count({
    where: query.where,
    orderBy: query.orderBy,
  });
}

export async function RGetPost(query: PostQuery): Promise<PostWithAuthor[]> {
  const skip = (query.page - 1) * query.rows;
  const result = await PrismaService.post.findMany({
    where: query.where,
    skip,
    take: query.rows,
    orderBy: query.orderBy,
    include: {
      Author: true,
    },
  });

  return result.length > 0
    ? result.map((it) => ({ post: it, author: it.Author }))
    : [];
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

export async function RDeletePost(
  request: DeletePostRequest,
): Promise<PostWithAuthor> {
  const result = await PrismaService.post.delete({
    where: {
      id: request.id,
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
