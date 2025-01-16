import PrismaService from '@common/prisma.service';
import { CreateUserRequest } from '@dtos/user.dtos';
import { User } from '@prisma/client';

export async function CreateNewUser(
  userRequest: CreateUserRequest,
): Promise<User> {
  return await PrismaService.user.create({
    data: {
      email: userRequest.email,
      password: userRequest.password,
      name: userRequest.name,
    },
  });
}

export async function IsEmailExists(email: string): Promise<boolean> {
  return (
    (await PrismaService.user.count({
      where: {
        email: email,
      },
    })) > 0
  );
}
