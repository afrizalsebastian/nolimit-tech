module.exports = {
  
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/prisma.mock.ts'],
  moduleNameMapper: {
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@services/(.*)': '<rootDir>/src/services/$1',
    '^@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '^@routes/(.*)': '<rootDir>/src/routes/$1',
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '^@common/(.*)': '<rootDir>/src/common/$1',
    '^@repositories/(.*)': '<rootDir>/src/repositories/$1',
    '^@dtos/(.*)': '<rootDir>/src/dtos/$1',
  },
};
