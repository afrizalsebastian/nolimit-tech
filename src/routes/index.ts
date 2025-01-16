import { Router } from 'express';
import UserRoutes from './user.routes';

export interface RouteName {
  name: string;
  router: Router;
}

const RoutesV1: RouteName[] = [{ name: `/user`, router: UserRoutes }];

export { RoutesV1 };
