import { CreatePost, GetPostById } from '@controllers/post.controller';
import AuthMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';

const PostRoutes = Router();

PostRoutes.post('/', AuthMiddleware, CreatePost);
PostRoutes.get('/:id', AuthMiddleware, GetPostById);

export default PostRoutes;
