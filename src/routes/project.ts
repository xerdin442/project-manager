import express from 'express';

import * as Project from '../controllers/project';
import { isLoggedIn, isProjectAdmin, isProjectMember } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.post('/projects/create/:userId', isLoggedIn, Project.createProject)
  router.put('/projects/update/:projectId', isLoggedIn, isProjectAdmin, Project.updateProject)
  router.delete('/projects/delete/:projectId', isLoggedIn, isProjectAdmin, Project.deleteProject)
  router.get('/projects/:projectId?role=member', isLoggedIn, isProjectMember, Project.getMembers)
  router.get('/projects/:projectId?role=admin', isLoggedIn, isProjectMember, Project.getAdmins)
  router.get('/projects/:projectId/members', isLoggedIn, isProjectMember, Project.getAllMembers)
  router.post('/projects/:projectId/new-admin/:userId', isLoggedIn, isProjectAdmin, Project.addAdmin)
  router.delete('/projects/:projectId/members/delete/:userId', isLoggedIn, isProjectAdmin, Project.deleteMember)
  router.post('/projects/:projectId/members/send-reminder/:memberId', isLoggedIn, isProjectAdmin, Project.sendReminder)
  router.get('/projects/:projectId/get-invite-link', isLoggedIn, isProjectAdmin, Project.getInviteLink)
  router.get('/projects/:projectId/invite/:inviteToken', Project.acceptInvite)
};
