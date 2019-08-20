import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.send(`<h1>hello world</h1>`);
});

export default routes;
