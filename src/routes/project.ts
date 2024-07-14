import express from 'express';

import * as Project from '../controllers/project';
import { isLoggedIn } from '../middlewares/authorization';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.post('/projects/create/:userId', isLoggedIn, Project.createProject)
  router.put('/projects/update/:projectId', isLoggedIn, Project.updateProject)
  router.delete('/projects/delete/:projectId', isLoggedIn, Project.deleteProject)
  router.get('/projects/:projectId?role=member', isLoggedIn, Project.getMembers)
  router.get('/projects/:projectId?role=admin', isLoggedIn, Project.getAdmins)
  router.get('/projects/:projectId/members', isLoggedIn, Project.getAllMembers)
  router.post('/projects/:projectId/new-admin/:userId', isLoggedIn, Project.addAdmin)
  router.delete('/projects/:projectId/members/delete/:userId', isLoggedIn, Project.deleteMember)
  router.post('/projects/:projectId/members/send-reminder/:memberId', isLoggedIn, Project.sendReminder)
  router.get('/projects/:projectId/get-invite-link', isLoggedIn, Project.getInviteLink)
  router.get('/projects/:projectId/invite/:inviteToken', Project.acceptInvite)
};
