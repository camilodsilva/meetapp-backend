import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import UserValidation from './app/middlewares/UserValidation';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserValidation.store, UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserValidation.update, UserController.update);

routes.post('/files', upload.single('file'), (req, res) => {
  return res.json();
});

export default routes;
