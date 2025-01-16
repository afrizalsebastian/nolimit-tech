import { Register } from '@controllers/user.controller';
import { Router } from 'express';

const UserRoutes = Router();

UserRoutes.post('/register', Register);

export default UserRoutes;
