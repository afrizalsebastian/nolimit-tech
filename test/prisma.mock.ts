import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import PrismaService from '../src/common/prisma.service';

jest.mock('../src/common/prisma.service', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock =
  PrismaService as unknown as DeepMockProxy<PrismaClient>;
