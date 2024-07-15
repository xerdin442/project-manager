import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { uuid } from 'uuidv4'
import passport from 'passport'

import * as User from '../services/user'
import { addMember } from '../services/project'
import { sendEmail } from '../helpers/mail'

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profileImage } = req.body // Extract required fields from request body

    // Handle image storage later***

    if (!email || !password || !username) {
      return res.status(400).send('All fields are required') // Send an error message if any of the required fields are missing
    }

    const existingUser = await User.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).send('User with that email already exits') // Send an error message if user with that email already exists
    }

    // If all the checks are successful, create a new user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.createUser({
      email,
      username,
      password: hashedPassword
    })

    return res.status(200).json(user).end() // Send a success message and the user information in JSON format
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body // Extract required fields from request body

    if (!email || !password) {
      return res.status(400).send('All fields are required') // Send an error message if any of the required fields are missing
    }

    // Check the email and send an error message if it does not exist
    const user = await User.getUserByEmail(email).select('+password')
    if (!user) {
      return res.status(400).send('No user found with that email')
    }

    // Check the entered password and send an error message if it is incorrect
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(400).send('Invalid password')
    }

    // Configure session data for newly logged in user
    req.session.isLoggedIn = true
    req.session.user = user

    /* When a user is redirected to login after clicking an invite,
    check for query parameters and add user as project member */
    const { inviteToken } = req.params
    if (inviteToken) { addMember(inviteToken, req, res) }

    return res.status(200).json({ message: 'Login successful' }).end() // Send a success message if login is complete
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered
  }
}

export const logout = (req: Request, res: Response) => {
  if (req.user) {
    req.logout(err => {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }

      return res.status(200).json({ message: 'You logged out' })
    })
  }

  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }

      return res.status(200).json({ message: 'You logged out' })
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    // Find user by email address and return an error if not found
    const user = await User.getUserByEmail(email)
    if (!user) {
      return res.status(400).send('User with that email does not exist')
    }
  
    // Continue if a user is registered with the email address
    user.resetToken = uuid() // Generate reset token to be sent to user
    user.resetTokenExpiration = Date.now() + 3600000 // Set the expiration time of the token
    await user.save() // Save changes
  
    sendEmail(user) // Send reset link to the user's email address
  
    return res.status(200).json({ message: 'A reset link has been sent to your email' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered
  }
}

export const getNewPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.params

    const user = await User.checkResetToken(resetToken)
    if (user) {
      return res.redirect(`/api/auth/change-password?resetToken=${user.resetToken}`)
    } else {
      return res.status(400).send('Invalid reset token')
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered      
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.query
    const { password } = req.body
  
    const user = await User.checkResetToken(resetToken as string)
    if (!user) {
      return res.status(400).send('Invalid reset token') // Send error message if token is invalid
    }
  
    // If reset token is valid, hash and update password and save changes
    const hashedPassword = await bcrypt.hash(password, 12)  
    user.password = hashedPassword
    // Reset token value and expiration date after use
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
  
    return res.status(200).send({ message: 'Password has been reset' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered 
  }
}

export const googleSignIn = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query
  const state = userId ? encodeURIComponent(JSON.stringify({ userId })) : ''

  passport.authenticate('google', {
    scope: ['email', 'profile'],
    state: state || undefined // Pass the state parameter if it exists
  })(req, res, next)
}

export const googleRedirect = (req: Request, res: Response) => {
  let state: any
  if (req.query.state) {
    state = JSON.parse(decodeURIComponent(req.query.state as string))
  }

  // Use the userId from state parameters if available, or the id from req.user
  const userId = state?.userId || req.user?.id

  res.redirect(`/users/profile/${userId}`)
}