import express from 'express';

import * as Comment from '../controllers/comment';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
}