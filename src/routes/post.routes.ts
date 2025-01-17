import {
  CreatePost,
  GetPostById,
  UpdatePost,
} from '@controllers/post.controller';
import AuthMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';

const PostRoutes = Router();

PostRoutes.post('/', AuthMiddleware, CreatePost);
PostRoutes.get('/:id', AuthMiddleware, GetPostById);
PostRoutes.put('/:id', AuthMiddleware, UpdatePost);

export default PostRoutes;
