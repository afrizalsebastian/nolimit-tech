import PrismaService from '@common/prisma.service';
import { RegisterRequest } from '@dtos/user.dtos';
import { User } from '@prisma/client';

export async function RCreateUser(userRequest: RegisterRequest): Promise<User> {
  return await PrismaService.user.create({
    data: {
      email: userRequest.email,
      password: userRequest.password,
      name: userRequest.name,
    },
  });
}

export async function RIsEmailExists(email: string): Promise<boolean> {
  return (
    (await PrismaService.user.count({
      where: {
        email: email,
      },
    })) > 0
  );
}

export async function RGetUserByEmail(email: string): Promise<User | null> {
  return await PrismaService.user.findFirst({
    where: {
      email: email,
    },
  });
}
