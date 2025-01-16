import { Logger } from '@common/logger.service';
import { LoginRequest, RegisterRequest, UserResponse } from '@dtos/user.dtos';
import { BadRequestError } from '@middlewares/errorHandler.middleware';
import { User } from '@prisma/client';
import {
  RCreateUser,
  RGetUserByEmail,
  RIsEmailExists,
} from '@repositories/user.repositories';
import { validate } from '@utils/dtosValidation.util';
import { ClaimsPayload, CreateToken } from '@utils/token.util';
import * as bcrypt from 'bcryptjs';
import { UserValidation } from './validation';

function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function SCreateUser(
  request: RegisterRequest,
): Promise<UserResponse> {
  Logger.debug(`services.user.SCreateUser ${request.email}`);

  const validRequest: RegisterRequest = validate(
    UserValidation.REGISTER,
    request,
  );

  const isEmailUsed = await RIsEmailExists(validRequest.email);
  if (isEmailUsed) {
    throw new BadRequestError('Email already used. Try another one.');
  }

  validRequest.password = await bcrypt.hash(validRequest.password, 10);
  const user = await RCreateUser(validRequest);

  return toUserResponse(user);
}

export async function SUserLogin(request: LoginRequest): Promise<string> {
  Logger.debug(`services.user.SUserLogin ${request.email}`);

  const validRequest: LoginRequest = validate(UserValidation.LOGIN, request);

  const user = await RGetUserByEmail(validRequest.email);
  if (!user) {
    throw new BadRequestError('Email or password incorrect. Try again.');
  }

  const isPasswordCorrect = await bcrypt.compare(
    validRequest.password,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new BadRequestError('Email or password incorrect. Try again.');
  }

  const claims: ClaimsPayload = {
    email: user.email,
    id: user.id,
    name: user.name,
  };

  const token = CreateToken(claims);
  return token;
}
