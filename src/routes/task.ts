import express from 'express';

import * as Task from '../controllers/task';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';
import { handleValidationErrors, validateContentLength, validateTaskDetails } from '../middlewares/validator';

export default (router: express.Router) => {
  router.post('/projects/:projectId/tasks/assign/:memberId', isLoggedIn, isProjectAdmin, validateTaskDetails, handleValidationErrors, Task.assignTask)
  router.put('/projects/:projectId/tasks/:taskId/update', isLoggedIn, isProjectAdmin, validateTaskDetails, handleValidationErrors, Task.updateTask)
  router.delete('/projects/:projectId/tasks/:taskId/delete', isLoggedIn, isProjectAdmin, Task.deleteTask)

  // Projects
  router.get('/projects/:projectId/tasks', isLoggedIn, isProjectMember, Task.getProjectTasks)
  router.get('/projects/:projectId/tasks/members/:memberId', isLoggedIn, isProjectMember, Task.getTasksPerMember)
  router.get('/projects/:projectId/tasks/submitted-tasks', isLoggedIn, isProjectAdmin, Task.getSubmittedTasks)

  // Task actions
  router.post('/projects/:projectId/tasks/:taskId/submit-task', isLoggedIn, isProjectMember, Task.submitTask)
  router.post('/projects/:projectId/tasks/:taskId/approve-task', isLoggedIn, isProjectAdmin, Task.approveTask)
  router.post('/projects/:projectId/tasks/:taskId/reject-task', isLoggedIn, isProjectAdmin, Task.rejectTask)

  // Comments
  router.post('/projects/:projectId/tasks/:taskId/new-comment', isLoggedIn, isProjectMember, validateContentLength, handleValidationErrors, Task.createComment)
  router.post('/projects/:projectId/tasks/:taskId/comments/:commentId/reply', isLoggedIn, isProjectMember, validateContentLength, handleValidationErrors, Task.replyComment)
  router.get('/projects/:projectId/tasks/:taskId/comments', isLoggedIn, isProjectMember, Task.getCommentsPerTask)
}