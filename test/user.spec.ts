import { LoginRequest, RegisterRequest } from '@dtos/user.dtos';
import * as bcrypt from 'bcryptjs';
import supertest from 'supertest';
import app from '../src/App';
import { prismaMock } from './prisma.mock';

describe('POST /api/v1/user/register', () => {
  it('should return error if validation error', async () => {
    const request = {
      email: 1,
      name: 1,
      password: 1,
    };

    const result = await supertest(app)
      .post('/api/v1/user/register')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if email already used', async () => {
    prismaMock.user.count.mockResolvedValue(1);

    const request: RegisterRequest = {
      name: 'user',
      email: 'user@mail.com',
      password: 'password',
    };

    const result = await supertest(app)
      .post('/api/v1/user/register')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data id, email, and name if success', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const dbResponse = {
      id: 1,
      email: 'user@mail.com',
      password: hashedPassword,
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.create.mockResolvedValue(dbResponse);

    const request: RegisterRequest = {
      name: 'user',
      email: 'user@mail.com',
      password: 'password',
    };

    const result = await supertest(app)
      .post('/api/v1/user/register')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(201);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(1);
    expect(result.body.data.email).toBe('user@mail.com');
    expect(result.body.data.name).toBe('user');
  });
});

describe('POST /api/v1/user/login', () => {
  it('should return error if validation error', async () => {
    const request = {
      email: 1,
      name: '',
      password: '',
    };

    const result = await supertest(app)
      .post('/api/v1/user/login')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if user not found', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const request: LoginRequest = {
      email: 'user@mail.com',
      password: 'password',
    };

    const result = await supertest(app)
      .post('/api/v1/user/login')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if password incorrect', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const dbResponse = {
      id: 1,
      email: 'user@mail.com',
      password: hashedPassword,
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.findFirst.mockResolvedValue(dbResponse);

    const request: LoginRequest = {
      email: 'user@mail.com',
      password: 'invalidpassword',
    };

    const result = await supertest(app)
      .post('/api/v1/user/login')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data token if login success', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const dbResponse = {
      id: 1,
      email: 'user@mail.com',
      password: hashedPassword,
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.findFirst.mockResolvedValue(dbResponse);

    const request: LoginRequest = {
      email: 'user@mail.com',
      password: 'password',
    };

    const result = await supertest(app)
      .post('/api/v1/user/login')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.token).toBeDefined();
  });
});
