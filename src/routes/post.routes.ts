import {
  CreatePost,
  DeletePost,
  GetPost,
  GetPostById,
  UpdatePost,
} from '@controllers/post.controller';
import AuthMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';

const PostRoutes = Router();

PostRoutes.post('/', AuthMiddleware, CreatePost);
PostRoutes.get('/', GetPost);
PostRoutes.get('/:id', GetPostById);
PostRoutes.put('/:id', AuthMiddleware, UpdatePost);
PostRoutes.delete('/:id', AuthMiddleware, DeletePost);

export default PostRoutes;
