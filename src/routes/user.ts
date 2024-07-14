import express from 'express';

import * as User from '../controllers/user';
import { isLoggedIn, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/users', User.getAll);
  router.get('/users/profile/:userId', isLoggedIn, User.getProfile)
  router.put('/users/update-profile/:userId', isLoggedIn, User.updateProfile)
  router.delete('/users/delete/:userId', isLoggedIn, User.deleteUser)
  
  // Projects
  router.get('/users/projects/:userId?role=member', isLoggedIn, User.getProjectsAsMember)
  router.get('/users/projects/:userId?role=admin', isLoggedIn, User.getProjectsAsAdmin)
  router.get('/users/projects/:userId', isLoggedIn, User.getUserProjects)
  
  // Reminders
  router.get('/users/reminders/:userId', isLoggedIn, User.getReminders)

  // Tasks
  router.get('/users/tasks/:userId', isLoggedIn, User.getUserTasks)
  router.get('/users/tasks/:projectId', isLoggedIn, isProjectMember, User.getTasksPerProject)
};
