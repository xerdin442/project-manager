import express from 'express';

import * as Project from '../controllers/project';
import { isLoggedIn, isProjectAdmin, isProjectMember, isProjectOwner } from '../middlewares/authorization';
import { handleValidationErrors, validateAddMember, validateProjectDetails, validateProjectStatus } from '../middlewares/validator';

export default (router: express.Router) => {
  router.get('/projects', Project.getAll);
  router.get('/projects/:projectId', isLoggedIn, isProjectMember, Project.projectDetails)
  router.post('/projects/new-project', isLoggedIn, validateProjectDetails, handleValidationErrors, Project.createProject)
  router.put('/projects/update/:projectId', isLoggedIn, isProjectOwner, validateProjectDetails, handleValidationErrors, Project.updateProject)
  router.patch('/projects/update-status/:projectId', isLoggedIn, isProjectOwner, validateProjectStatus, handleValidationErrors, Project.updateStatus)
  router.delete('/projects/delete/:projectId', isLoggedIn, isProjectOwner, Project.deleteProject)
  
  // Membership
  router.get('/projects/:projectId/members', isLoggedIn, isProjectMember, Project.getAllMembers)
  router.get('/projects/:projectId/members/role', isLoggedIn, isProjectMember, Project.getMembersByRole)
  router.patch('/projects/:projectId/new-admin/:memberId', isLoggedIn, isProjectOwner, Project.addAdmin)
  router.post('/projects/:projectId/members/add-member', isLoggedIn, isProjectOwner, validateAddMember, handleValidationErrors, Project.addMember)
  router.delete('/projects/:projectId/members/delete/:memberId', isLoggedIn, isProjectOwner, Project.deleteMember)
  
  // Reminders
  router.post('/projects/:projectId/members/send-reminder/:memberId', isLoggedIn, isProjectAdmin, Project.sendReminder)
  
  // Progress
  router.get('/projects/:projectId/progress', Project.getProgress)
};