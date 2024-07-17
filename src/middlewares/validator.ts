import { check, ValidationChain } from "express-validator";
import bcrypt from 'bcryptjs'

import * as User from '../services/user'

export const validateSignup: ValidationChain[] = [
  check('username').trim()
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters')
    .isLength({ max: 30 }).withMessage('Username cannot be more than 30 characters'),

  check('email').normalizeEmail()
    .isEmail().withMessage('Please enter a valid email')
    .custom(async (value: string) => {
      const user = await User.getUserByEmail(value)
      if (user) {
        return Promise.reject('User with that email address already exists')
      }
    }),

  check('password').trim()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((value: string) => {
      const passwordStrengthCheck: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,}$/
      if (passwordStrengthCheck.test(value)) {
        return Promise.reject(``)
      }
    }),

  check('confirmPassword').trim()
    .custom(async (value: string, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject('Passwords do not match!')
      }
    })
]

export const validateLogin: ValidationChain[] = [
  check('email').normalizeEmail()
    .isEmail().withMessage('Please enter a valid email')
    .custom(async (value: string, { req }) => {
      // Check the email and send an error message if it does not exist
      const user = await User.getUserByEmail(value).select('+password')
      if (!user) {
        return Promise.reject('No user found with that email')
      }

      // Check the entered password and send an error message if it is invalid
      const checkPassword = await bcrypt.compare(req.body.password, user.password)
      if (!checkPassword) {
        return Promise.reject('Invalid password')
      }
    })
]

export const validatePasswordReset: ValidationChain[] = [
  check('password').trim()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom(async (value: string, { req }) => {
      const passwordStrengthCheck: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,}$/
      if (passwordStrengthCheck.test(value)) {
        return Promise.reject(``)
      }

      const user = await User.checkResetToken(req.query.resetToken)
      const checkMatch = await bcrypt.compare(value, user.password)
      if (checkMatch) {
        return Promise.reject('New password cannot be set to same value as previous password')
      }
    }),
]