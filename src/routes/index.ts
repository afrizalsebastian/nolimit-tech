import { Router } from 'express';
import PostRoutes from './post.routes';
import UserRoutes from './user.routes';

export interface RouteName {
  name: string;
  router: Router;
}

const RoutesV1: RouteName[] = [
  { name: 'user', router: UserRoutes },
  { name: 'post', router: PostRoutes },
];

export { RoutesV1 };
