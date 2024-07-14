import express from 'express';

import * as User from '../controllers/user';
import { isLoggedIn } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/users', User.getAll);
  router.get('/users/profile/:userId', isLoggedIn, User.getProfile)
  router.put('/users/update-profile/:userId', isLoggedIn, User.updateProfile)
  router.delete('/users/delete/:userId', isLoggedIn, User.deleteUser)
  router.get('/users/projects/:userId?role=member', isLoggedIn, User.getProjectsAsMember)
  router.get('/users/projects/:userId?role=admin', isLoggedIn, User.getProjectsAsAdmin)
  router.get('/users/projects/:userId', isLoggedIn, User.getUserProjects)
  router.get('/users/reminders/:userId', isLoggedIn, User.getReminders)
};
