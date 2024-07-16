import express from 'express';

import * as Project from '../controllers/project';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.get('/projects/:projectId', isLoggedIn, isProjectMember, Project.projectDetails)
  router.post('/projects/new-project', isLoggedIn, Project.createProject)
  router.post('/projects/update/:projectId', isLoggedIn, isProjectAdmin, Project.updateProject)
  router.post('/projects/update-status/:projectId', isLoggedIn, isProjectAdmin, Project.updateStatus)
  router.delete('/projects/delete/:projectId', isLoggedIn, isProjectAdmin, Project.deleteProject)
  
  // Membership
  router.get('/projects/:projectId/members', isLoggedIn, isProjectMember, Project.getAllMembers)
  router.get('/projects/:projectId/members?role=member', isLoggedIn, isProjectMember, Project.getMembers)
  router.get('/projects/:projectId/members?role=admin', isLoggedIn, isProjectMember, Project.getAdmins)
  router.post('/projects/:projectId/new-admin/:memberId', isLoggedIn, isProjectAdmin, Project.addAdmin)
  router.delete('/projects/:projectId/members/delete/:memberId', isLoggedIn, isProjectAdmin, Project.deleteMember)
  
  // Reminders
  router.post('/projects/:projectId/members/send-reminder/:memberId', isLoggedIn, isProjectAdmin, Project.sendReminder)
  
  // Invites
  router.get('/projects/:projectId/get-invite', isLoggedIn, isProjectAdmin, Project.getInviteLink)
  router.get('/projects/:projectId/invite/:inviteToken', Project.acceptInvite)

  // Progress
  router.get('/projects/:projectId/progress', Project.getProgress)
};