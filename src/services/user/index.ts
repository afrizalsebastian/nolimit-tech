import { Logger } from '@common/logger.service';
import { CreateUserRequest, UserResponse } from '@dtos/user.dtos';
import { BadRequestError } from '@middlewares/errorHandler.middleware';
import { User } from '@prisma/client';
import { CreateNewUser, IsEmailExists } from '@repositories/user.repositories';
import { validate } from '@utils/dtosValidation.util';
import * as bcrypt from 'bcryptjs';
import { UserValidation } from './validation';

function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function CreateUser(
  request: CreateUserRequest,
): Promise<UserResponse> {
  Logger.debug(`services.user.CreateUser`);

  const validRequest: CreateUserRequest = validate(
    UserValidation.REGISTER,
    request,
  );

  const isEmailUsed = await IsEmailExists(validRequest.email);
  if (isEmailUsed) {
    throw new BadRequestError('Email already used. Try another one.');
  }

  validRequest.password = await bcrypt.hash(validRequest.password, 10);
  const user = await CreateNewUser(validRequest);

  return toUserResponse(user);
}
