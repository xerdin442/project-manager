import express from 'express';

import * as User from '../controllers/user';

export default (router: express.Router) => {
  router.get('/users', User.getAll);
  router.put('/users/update-profile/:userId', User.updateProfile)
  router.delete('/users/delete/:userId', User.deleteUser)
  router.get('/users/projects/:userId?role=member', User.getProjectsAsMember)
  router.get('/users/projects/:userId?role=admin', User.getProjectsAsAdmin)
  router.get('/users/projects/:userId', User.getUserProjects)
  router.get('/users/reminders/:userId', User.getReminders)
};
