import passport from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth2';

import { User } from "../models/user";
import { createUser } from "../services/user";

export const googleAuth = () => {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/redirect',
      passReqToCallback: true
    },
    async (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
      try {
        const user = await User.findOne({ googleId: profile.id }) // Check if user exists
  
        if (!user) {
          const newUser = await createUser({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value
          })
          
          done(null, newUser)
        } else {
          done(null, user)
        }  
      } catch (error) {
        console.log(error)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      console.log(error)
      done(null, false)
    }
  })
}