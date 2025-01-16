import { Login, Register } from '@controllers/user.controller';
import { Router } from 'express';

const UserRoutes = Router();

UserRoutes.post('/register', Register);
UserRoutes.post('/login', Login);

export default UserRoutes;
