import express from 'express';

import * as Task from '../controllers/task';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/projects/:projectId/tasks/', isLoggedIn, isProjectMember, Task.getProjectTasks)
  router.get('/projects/:projectId/tasks/:memberId', isLoggedIn, isProjectMember, Task.getTasksPerMember)
  router.post('/projects/:projectId/tasks/assign/:memberId', isLoggedIn, isProjectAdmin, Task.assignTask)
  router.post('/projects/:projectId/tasks/update/:taskId', isLoggedIn, isProjectAdmin, Task.updateTask)
  router.delete('/projects/:projectId/tasks/delete/:taskId', isLoggedIn, isProjectAdmin, Task.deleteTask)
}