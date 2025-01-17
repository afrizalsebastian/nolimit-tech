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

describe('GET /api/v1/post', () => {
  it('should return empty posts if post length 0', async () => {
    prismaMock.post.count.mockResolvedValue(0);
    prismaMock.post.findMany.mockResolvedValue([]);

    const result = await supertest(app)
      .get('/api/v1/post')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(0);
    expect(result.body.data.page).toBe(1);
    expect(result.body.data.totalPage).toBe(0);
  });

  it('should return data posts if post exits', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .get('/api/v1/post')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(2);
    expect(result.body.data.page).toBe(1);
    expect(result.body.data.totalPage).toBe(1);
  });

  it('should return data posts using rows query', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue([dbResponse[1]]);

    const result = await supertest(app)
      .get('/api/v1/post?rows=1')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(1);
    expect(result.body.data.page).toBe(1);
    expect(result.body.data.totalPage).toBe(2);
  });

  it('should return error if query rows use not integer', async () => {
    const result = await supertest(app)
      .get('/api/v1/post?rows=page')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data posts using page query', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue([]);

    const result = await supertest(app)
      .get('/api/v1/post?page=2')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(0);
    expect(result.body.data.page).toBe(2);
    expect(result.body.data.totalPage).toBe(1);
  });

  it('should return error if query page use not integer', async () => {
    const result = await supertest(app)
      .get('/api/v1/post?page=not-integer')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data posts using sort query', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .get('/api/v1/post?sort=-id') //using '-' mean desc
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(2); //sort
    expect(result.body.data.posts[0].id).toBe(1);
  });

  it('should return error if query sort use not valid key', async () => {
    const result = await supertest(app)
      .get('/api/v1/post?sort=content')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toContain('Invalid key for sort');
  });

  it('should return data posts using search query', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(1);
    prismaMock.post.findMany.mockResolvedValue([dbResponse[1]]);

    const result = await supertest(app)
      .get('/api/v1/post?search.content=2') // search query using '.' for seperate functional and search query
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(1); // search
    expect(result.body.data.posts[0].id).toBe(2);
    expect(result.body.data.posts[0].content).toContain('2');
  });

  it('should return error if search query key not valid', async () => {
    const result = await supertest(app)
      .get('/api/v1/post?search.title=2') // search query using '.' for seperate functional and search query
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toContain('Invalid key for search');
  });

  it('should return data posts using search query', async () => {
    const dbResponse = [
      {
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
      },
      {
        id: 2,
        content: 'Post Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .get('/api/v1/post?createdAt.gt=2024-12-02') // range query using '.' for seperate range query and function (lt means less than) (gt, gte, lte)
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(2); // range
  });

  it('should return error if range query key not valid', async () => {
    const result = await supertest(app)
      .get('/api/v1/post?content.lt=2') // range query using '.' for seperate functional and range query
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toContain('Invalid key for range');
  });

  it('should return data posts using multiple query', async () => {
    const dbResponse = [
      {
        id: 3,
        content: 'Post Content 23',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
      {
        id: 2,
        content: 'Post Content 23',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Author: {
          id: 1,
          email: 'user@mail.com',
          name: 'user',
        },
      },
    ];

    prismaMock.post.count.mockResolvedValue(dbResponse.length);
    prismaMock.post.findMany.mockResolvedValue(dbResponse);

    const result = await supertest(app)
      .get(
        '/api/v1/post?rows=3&page=1&search.content=23&createdAt.gt=2024-12-02&sort=-id',
      )
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(200);
    expect(result.body.status).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.posts).toHaveLength(2); // range
    expect(result.body.data.posts[0].id).toBe(3); // range
  });
});

describe('GET /api/v1/post/:id', () => {
  it('should return error if path validation error', async () => {
    const result = await supertest(app)
      .get('/api/v1/post/postId')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(400);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return error if post not found', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const result = await supertest(app)
      .get('/api/v1/post/1')
      .set('Accept', 'application/json');

    expect(result.statusCode).toBe(404);
    expect(result.body.status).toBe(false);
    expect(result.body.error).toBeDefined();
  });

  it('should return data if success', async () => {
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
