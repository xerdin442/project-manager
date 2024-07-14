import express from 'express';

import user from './user'
import project from './project';
import auth from './auth';

const router = express.Router()

export default (): express.Router => {
  user(router)
  project(router)
  auth(router)
  
  return router;
}