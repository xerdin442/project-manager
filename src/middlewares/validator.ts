import { check, ValidationChain, validationResult } from "express-validator";
import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from "express";

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
        throw new Error('User with that email address already exists')
      }

      return true;
    }),

  check('password').trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value: string) => {
      const passwordStrengthCheck: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/
      if (!passwordStrengthCheck.test(value)) {
        throw new Error(`Password must contain at least one uppercase letter, one lowercase letter, one digit and one of the following symbols: $@$!%*?&_`)
      }

      return true;
    }),

  check('confirmPassword').trim()
    .custom(async (value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!')
      }

      return true;
    })
]

export const validateLogin: ValidationChain[] = [
  check('email').normalizeEmail()
    .isEmail().withMessage('Please enter a valid email')
    .custom(async (value: string, { req }) => {
      // Check the email and send an error message if it does not exist
      const user = await User.getUserByEmail(value).select('+password')
      if (!user) {
        throw new Error('No user found with that email')
      }

      // Check the entered password and send an error message if it is invalid
      const checkPassword = await bcrypt.compare(req.body.password, user.password)
      if (!checkPassword) {
        throw new Error('Invalid password')
      }

      return true;
    })
]

export const validatePasswordReset: ValidationChain[] = [
  check('password').trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom(async (value: string, { req }) => {
      const passwordStrengthCheck: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/
      if (!passwordStrengthCheck.test(value)) {
        throw new Error(`Password must contain at least one uppercase letter, one lowercase letter, one digit and one of the following symbols: $@$!%*?&_`)
      }

      const user = await User.checkResetToken(req.query.resetToken)
      const checkMatch = await bcrypt.compare(value, user.password)
      if (checkMatch) {
        throw new Error('New password cannot be set to same value as previous password')
      }

      return true;
    }),
]

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  // Extract all validation errors, if any, and return the error message
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg
    return res.status(400).json({ message })
  }

  next() // Proceed to next middleware if there are no errors
}