import express from 'express';
import passport from 'passport';

import * as Auth from '../controllers/auth';

export default (router: express.Router) => {
  router.post('/auth/register', Auth.register);
  router.post('/auth/login', Auth.login);
  router.post('/auth/reset', Auth.resetPassword)
  router.get('/auth/reset/:resetToken', Auth.getNewPassword)
  router.post('/auth/change-password', Auth.changePassword)

  // Redirect to google consent screen after user opts to sign in with google
  router.get('/auth/google', Auth.googleSignIn)
  router.get('/auth/google/redirect', passport.authenticate('google'), Auth.googleRedirect)
}