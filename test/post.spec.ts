import { ClaimsPayload, CreateToken } from '@utils/token.util';
import supertest from 'supertest';
import app from '../src/App';
import { prismaMock } from './prisma.mock';

describe('POST /api/v1/post/', () => {
  it('should return error if unauthenticated', async () => {
    const request = {
      content: 'Post Content',
    };

    const result = await supertest(app)
      .post('/api/v1/post')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if token invalid', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);
    const request = {
      content: 'Post Content',
    };

    const result = await supertest(app)
      .post('/api/v1/post')
      .send(request)
      .set('Authorization', `Bearer a${token}`) //invalid token
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if validation error', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);
    const request = {
      content: '',
    };

    const result = await supertest(app)
      .post('/api/v1/post')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data if success', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const dbResponse = {
      id: 1,
      content: 'Post Content',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Author: {
        id: 1,
        email: 'user@mail.com',
        name: 'user',
      },
    };
    prismaMock.post.create.mockResolvedValue(dbResponse);

    const request = {
      content: 'Post Content',
    };

    const result = await supertest(app)
      .post('/api/v1/post')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(201);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.content).toBe('Post Content');
    expect(result.body.data.id).toBe(1);
    expect(result.body.data.updatedAt).toBeDefined();
    expect(result.body.data.author).toBeDefined();
  });
});

describe('GET /api/v1/post/:id', () => {
  it('should return error if path validation error', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const result = await supertest(app)
      .get('/api/v1/post/postId')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if post not found', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    prismaMock.post.findFirst.mockResolvedValue(null);

    const result = await supertest(app)
      .get('/api/v1/post/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(404);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data if success', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const dbResponse = {
      id: 1,
      content: 'Post Content',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Author: {
        id: 1,
        email: 'user@mail.com',
        name: 'user',
      },
    };
    prismaMock.post.findFirst.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .get('/api/v1/post/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.content).toBe('Post Content');
    expect(result.body.data.id).toBe(1);
    expect(result.body.data.updatedAt).toBeDefined();
    expect(result.body.data.author).toBeDefined();
  });
});

describe('PUT /api/v1/post/:id', () => {
  it('should return error if unauthenticated', async () => {
    const request = {
      content: 'Post Content',
    };

    const result = await supertest(app)
      .put('/api/v1/post/1')
      .send(request)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if token invalid', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);
    const request = {
      content: 'Post Content',
    };

    const result = await supertest(app)
      .put('/api/v1/post/1')
      .send(request)
      .set('Authorization', `Bearer a${token}`) //invalid token
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if path validation error', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const request = {
      content: 'Post Request',
    };

    const result = await supertest(app)
      .put('/api/v1/post/postId')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if validation error', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);
    const request = {
      content: '',
    };

    const result = await supertest(app)
      .put('/api/v1/post/1')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if post not found', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    prismaMock.post.count.mockResolvedValue(0);

    const request = {
      content: 'Post Updated',
    };

    const result = await supertest(app)
      .put('/api/v1/post/1')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(404);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data if success', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const dbResponse = {
      id: 1,
      content: 'Post Content Updated',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Author: {
        id: 1,
        email: 'user@mail.com',
        name: 'user',
      },
    };
    prismaMock.post.count.mockResolvedValue(1);
    prismaMock.post.update.mockResolvedValue(dbResponse);

    const request = {
      content: 'Post Content Updated',
    };

    const result = await supertest(app)
      .put('/api/v1/post/1')
      .send(request)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.content).toBe('Post Content Updated');
    expect(result.body.data.id).toBe(1);
    expect(result.body.data.updatedAt).toBeDefined();
    expect(result.body.data.author).toBeDefined();
  });
});

describe('DELETE /api/v1/post/:id', () => {
  it('should return error if unauthenticated', async () => {
    const result = await supertest(app)
      .delete('/api/v1/post/1')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if token invalid', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const result = await supertest(app)
      .delete('/api/v1/post/1')
      .set('Authorization', `Bearer a${token}`) //invalid token
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(401);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if path validation error', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const result = await supertest(app)
      .delete('/api/v1/post/postId')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if post not found', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    prismaMock.post.count.mockResolvedValue(0);

    const result = await supertest(app)
      .delete('/api/v1/post/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(404);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data if success', async () => {
    const claims: ClaimsPayload = {
      id: 1,
      email: 'user@mail.com',
      name: 'user',
    };
    const token = CreateToken(claims);

    const dbResponse = {
      id: 1,
      content: 'Post Content',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Author: {
        id: 1,
        email: 'user@mail.com',
        name: 'user',
      },
    };
    prismaMock.post.count.mockResolvedValue(1);
    prismaMock.post.delete.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .delete('/api/v1/post/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.content).toBe('Post Content');
    expect(result.body.data.id).toBe(1);
    expect(result.body.data.updatedAt).toBeDefined();
    expect(result.body.data.author).toBeDefined();
  });
});
