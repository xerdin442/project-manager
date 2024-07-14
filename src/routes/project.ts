import express from 'express';

import * as Project from '../controllers/project';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.post('/projects/create/:userId', Project.createProject)
  router.put('/projects/update/:projectId', Project.updateProject)
  router.delete('/projects/delete/:projectId', Project.deleteProject)
  router.get('/projects/:projectId?role=member', Project.getMembers)
  router.get('/projects/:projectId?role=admin', Project.getAdmins)
  router.get('/projects/:projectId/members', Project.getAllMembers)
  router.post('/projects/:projectId/new-admin/:userId', Project.addAdmin)
  router.delete('/projects/:projectId/members/delete/:userId', Project.deleteMember)
  router.post('/projects/:projectId/members/send-reminder/:memberId', Project.sendReminder)
  router.get('/projects/:projectId/get-invite-link', Project.getInviteLink)
};
