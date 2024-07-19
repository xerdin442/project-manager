import express from 'express';

import * as Auth from '../controllers/auth';
import { isLoggedIn } from '../middlewares/authorization';
import { upload } from '../config/storage';
import { validateLogin, validatePasswordReset, validateSignup, handleValidationErrors } from '../middlewares/validator';

export default (router: express.Router) => {
  router.post('/auth/register', upload('project-manager').single('profileImage'), validateSignup, handleValidationErrors, Auth.register);
  router.post('/auth/login', validateLogin, handleValidationErrors, Auth.login);
  router.post('/auth/logout', isLoggedIn, Auth.logout);
  router.post('/auth/reset', Auth.resetPassword)
  router.post('/auth/confirm-reset', Auth.checkResetToken)
  router.post('/auth/resend-token', Auth.resendToken)
  router.post('/auth/change-password', validatePasswordReset, handleValidationErrors, Auth.changePassword)

  // Redirect to google consent screen after user opts to sign in with google
  router.get('/auth/google', Auth.getGoogleConsentPage)
  router.get('/auth/google/redirect', Auth.handleGoogleRedirect)
}