import express from 'express';

import user from './user'
import project from './project';

const router = express.Router()

export default (): express.Router => {
  user(router)
  project(router)
  
  return router;
}