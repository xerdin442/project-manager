import express from 'express';

import * as Task from '../controllers/task';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/projects/:projectId/tasks/', isLoggedIn, isProjectMember, Task.getProjectTasks)
  router.get('/projects/:projectId/tasks/:memberId', isLoggedIn, isProjectMember, Task.getTasksPerMember)
  router.get('/projects/:projectId/tasks/submitted-tasks', isLoggedIn, isProjectAdmin, Task.getSubmittedTasks)
  router.post('/projects/:projectId/tasks/assign/:memberId', isLoggedIn, isProjectAdmin, Task.assignTask)
  router.post('/projects/:projectId/tasks/update/:taskId', isLoggedIn, isProjectAdmin, Task.updateTask)
  router.delete('/projects/:projectId/tasks/delete/:taskId', isLoggedIn, isProjectAdmin, Task.deleteTask)
  router.get('/projects/:projectId/tasks/:taskId/submit-task', isLoggedIn, isProjectMember, Task.submitTask)
  router.get('/projects/:projectId/tasks/:taskId/approve-task', isLoggedIn, isProjectAdmin, Task.approveTask)

  // Comments
  router.post('/projects/:projectId/tasks/:taskId/new-comment', isLoggedIn, isProjectMember, Task.createComment)
  router.post('/projects/:projectId/tasks/:taskId/comments/:commentId/reply', isLoggedIn, isProjectMember, Task.replyComment)
  router.get('/projects/:projectId/tasks/:taskId/comments', isLoggedIn, isProjectMember, Task.createComment)
}