import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import BannerController from './app/controllers/BannerController';
import MeetupController from './app/controllers/MeetupController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import MeetupValidation from './app/middlewares/MeetupValidation';
import UserValidation from './app/middlewares/UserValidation';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserValidation.store, UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserValidation.update, UserController.update);

routes.get('/meetups', MeetupController.index);
routes.post(
  '/meetups',
  MeetupValidation.pastDateValidation,
  MeetupController.store
);
routes.put(
  '/meetups/:id',
  MeetupValidation.pastDateValidation,
  MeetupValidation.meetupOwnerValidation,
  MeetupController.update
);
routes.delete(
  '/meetups/:id',
  MeetupValidation.meetupOwnerValidation,
  MeetupController.delete
);

routes.post('/banners', upload.single('file'), BannerController.store);

export default routes;
