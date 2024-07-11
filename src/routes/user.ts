import express from 'express';

import { deleteUser, getAllUsers, getReminders, getUserProjects, updateProfile } from '../controllers/user';

export default (router: express.Router) => {
  router.get('/users', getAllUsers);
  router.post('/users/update-profile/:userId', updateProfile)
  router.post('/users/delete-user/:userId', deleteUser)
  router.post('/users/projects/:userId', getUserProjects)
  router.post('/users/reminders/:userId', getReminders)
};
