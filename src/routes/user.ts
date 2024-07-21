import express from 'express';

import * as User from '../controllers/user';
import { isAuthenticated, isProjectMember } from '../middlewares/authorization';
import { upload } from '../config/storage';
import { handleValidationErrors, validateUserDetails } from '../middlewares/validator';

export default (router: express.Router) => {
  router.get('/users', User.getAll);
  router.get('/users/:userId/profile', isAuthenticated, User.getProfile)
  router.put('/users/:userId/update-profile', upload('project-manager').single('profileImage'), isAuthenticated, validateUserDetails, handleValidationErrors, User.updateProfile)
  router.delete('/users/:userId/delete-account', isAuthenticated, User.deleteUser)
  
  // Projects
  router.get('/users/:userId/projects/role', isAuthenticated, User.getProjectsByRole)
  router.get('/users/:userId/projects', isAuthenticated, User.getUserProjects)
  
  // Reminders
  router.get('/users/:userId/reminders', isAuthenticated, User.getReminders)
  router.delete('/users/:userId/reminders/delete/:reminderId', isAuthenticated, User.deleteReminder)

  // Tasks
  router.get('/users/:userId/tasks', isAuthenticated, User.getUserTasks)
  router.get('/users/:userId/tasks/:projectId', isProjectMember, User.getTasksPerProject)
};
