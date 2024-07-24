import express from 'express';

import * as Project from '../controllers/project';
import { isLoggedIn, isProjectAdmin, isProjectMember, isProjectOwner } from '../middlewares/authorization';
import { handleValidationErrors, validateContentLength, validateProjectDetails, validateProjectStatus } from '../middlewares/validator';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.get('/projects/:projectId', isLoggedIn, isProjectMember, Project.projectDetails)
  router.post('/projects/new-project', isLoggedIn, validateProjectDetails, handleValidationErrors, Project.createProject)
  router.put('/projects/update/:projectId', isLoggedIn, isProjectAdmin, isProjectOwner, validateProjectDetails, handleValidationErrors, Project.updateProject)
  router.patch('/projects/update-status/:projectId', isLoggedIn, isProjectAdmin, isProjectOwner, validateProjectStatus, handleValidationErrors, Project.updateStatus)
  router.delete('/projects/delete/:projectId', isLoggedIn, isProjectAdmin, isProjectOwner, Project.deleteProject)
  
  // Membership
  router.get('/projects/:projectId/members', isLoggedIn, isProjectMember, Project.getAllMembers)
  router.get('/projects/:projectId/members/role', isLoggedIn, isProjectMember, Project.getMembersByRole)
  router.patch('/projects/:projectId/new-admin/:memberId', isLoggedIn, isProjectAdmin, isProjectOwner, Project.addAdmin)
  router.delete('/projects/:projectId/members/delete/:memberId', isLoggedIn, isProjectAdmin, isProjectOwner, Project.deleteMember)
  
  // Reminders
  router.post('/projects/:projectId/members/send-reminder/:memberId', isLoggedIn, isProjectAdmin, validateContentLength, handleValidationErrors, Project.sendReminder)
  
  // Invites
  router.get('/projects/:projectId/get-invite', isLoggedIn, isProjectAdmin, Project.getInviteLink)
  router.get('/projects/:projectId/invite/:inviteToken', Project.acceptInvite)

  // Progress
  router.get('/projects/:projectId/progress', Project.getProgress)
};