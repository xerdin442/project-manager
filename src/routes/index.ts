import express from 'express';

import user from './user'
import project from './project';
import auth from './auth';
import task from './task';
import comment from './comment';

const router = express.Router()

export default (): express.Router => {
  user(router)
  project(router)
  auth(router)
  task(router)
  comment(router)
  
  return router;
}