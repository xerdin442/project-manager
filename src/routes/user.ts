import express from 'express';

import * as User from '../controllers/user';
import { isAuthenticated, isProjectMember } from '../middlewares/authorization';
import { upload } from '../config/storage';

export default (router: express.Router) => {
  router.get('/users', User.getAll);
  router.get('/users/profile/:userId', isAuthenticated, User.getProfile)
  router.put('/users/update/:userId', upload('project-manager').single('profileImage'), isAuthenticated, User.updateProfile)
  router.delete('/users/delete/:userId', isAuthenticated, User.deleteUser)
  
  // Projects
  router.get('/users/projects/:userId/role', isAuthenticated, User.getProjectsByRole)
  router.get('/users/projects/:userId', isAuthenticated, User.getUserProjects)
  
  // Reminders
  router.get('/users/reminders/:userId', isAuthenticated, User.getReminders)

  // Tasks
  router.get('/users/tasks/:userId', isAuthenticated, User.getUserTasks)
  router.get('/users/tasks/:projectId', isProjectMember, User.getTasksPerProject)
};
