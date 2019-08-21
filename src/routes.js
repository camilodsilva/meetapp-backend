import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import UserValidation from './app/middlewares/UserValidation';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserValidation.store, UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserValidation.update, UserController.update);

export default routes;
