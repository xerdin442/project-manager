import express from 'express';

import * as Auth from '../controllers/auth';

export default (router: express.Router) => {
  router.post('/auth/register', Auth.register);
  router.post('/auth/login', Auth.login);
}