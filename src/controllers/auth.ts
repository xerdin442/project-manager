import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import * as User from '../services/user'
import { addMember } from '../services/project'
import { sendEmail } from '../util/mail'
import { getGoogleAuthUrl, handleGoogleCallback } from '../config/authentication'
import { validateRequest } from '../util/error'

export const register = async (req: Request, res: Response) => {
  try {
    // Extract required fields from request body
    let { username, email, password, profileImage } = req.body

    validateRequest(req, res) // Return any validation error messages

    /* Use a default image if user does not upload file
    Or set profileImage to path of stored image if user uploads file */
    if (!req.file) {
      profileImage = process.env.DEFAULT_IMAGE
    } else {
      profileImage = req.file.path
    }

    // Resizing of images***

    // If all the checks are successful, create a new user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.createUser({
      email,
      username,
      password: hashedPassword,
      profileImage
    })

    // Send success message if registration is complete
    return res.status(200).json({ message: 'Registration successful, you can now login.', user: user }).end()
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body // Extract required fields from request body

    validateRequest(req, res) // Return any validation error messages

    // If all checks are successful, configure session data for newly logged in user
    const user = await User.getUserByEmail(email)
    req.session.user = user

    /* When a user is redirected to the login page after clicking an invite,
    check for query parameters and add user as project member */
    const { inviteToken } = req.params
    if (inviteToken) { addMember(inviteToken, req, res) }

    return res.status(200).json({ message: 'Login successful' }).end() // Send a success message if login is complete
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const logout = (req: Request, res: Response) => {
  // Delete and reset session data before logout
  req.session.destroy((err) => {
    if (err) {
      // Log and send an error message if any server errors are encountered
      console.log(err)
      return res.sendStatus(500)
    }

    return res.status(200).json({ message: 'You logged out' })
  })
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body // Extract email from request body
    const token = Math.ceil(Math.random() * 10 ** 6) // Generate reset token that will be sent to the user

    // Find user by email address and return an error if not found
    const user = await User.getUserByEmail(email)
    if (!user) {
      return res.status(400).send('User with that email does not exist')
    }
  
    // If user check is successful, set the token, expiration time and save changes
    user.resetToken = token
    user.resetTokenExpiration = Date.now() + 90000
    await user.save()
  
    await sendEmail(user) // Send reset token to the user's email address
    req.session.email = user.email // Save user's email address in a session incase the user requests for the token to be re-sent
  
    console.log(token)
    // Notify user that password reset token has been sent
    return res.status(200).json({ message: 'A reset token has been sent to your email' }).end()
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const checkResetToken = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.body // Extract reset token from request body

    // Check if reset token is valid
    const user = await User.checkResetToken(resetToken)
    if (!user) {
      return res.status(400).send('Invalid reset token')
    }

    // Check if reset token has expired
    const currentTime = new Number(Date.now())
    if (user.resetTokenExpiration < currentTime) {
      return res.status(400).json({ message: 'The reset token has expired' })
    }

    // Reset token expiration time if the token is valid and save changes
    user.resetTokenExpiration = undefined
    await user.save()

    // Delete session created earlier for storing email and resending tokens
    req.session.destroy((err) => {
      if (err) { console.log(err) }
    })

    // Return redirect URL containing user's reset token
    const redirectURL = `http://localhost:3000/api/auth/change-password?resetToken=${user.resetToken}`
    
    return res.status(200).json({ redirectURL })
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const resendToken = async (req: Request, res: Response) => {
  try {
    // Check if user exists with the email stored in session
    const user = await User.getUserByEmail(req.session.email)
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    // Generate new reset token, reset the expiration time and save changes
    const token = Math.ceil(Math.random() * 10 ** 6)
    user.resetToken = token
    user.resetTokenExpiration = Date.now() + 120000
    await user.save()

    await sendEmail(user) // Send email with new reset token to user

    console.log(token)
    // Notify user that password reset token has been re-sent
    return res.status(200).json({ message: 'Another token has been sent to your email' })
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    // Extract reset token from query paramters and new password from request body
    const { resetToken } = req.query
    const { password } = req.body

    validateRequest(req, res) // Return any validation error messages
  
    const user = await User.checkResetToken(resetToken as string)
    if (!user) {
      return res.status(400).send('Invalid reset token') // Send error message if reset token is invalid
    }
  
    // If reset token is valid, change password, reset the token value and save changes
    const hashedPassword = await bcrypt.hash(password, 12)  
    user.password = hashedPassword
    user.resetToken = undefined
    await user.save()
  
    // Notify user if password reset is successful
    return res.status(200).send({ message: 'Password has been reset' })
  } catch (error) {
    // Log and send an error message if any server errors are encountered
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getGoogleConsentPage = (req: Request, res: Response) => {
  const url = getGoogleAuthUrl()
  if (!url) {
    return res.status(400).json({ message: 'Error generating google authentication link' })
  }

  return res.status(200).json({ url })
}

export const handleGoogleRedirect = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const user = await handleGoogleCallback(code as string);

    if (!user) {
      return res.status(400).send('An error occured during login')
    }

    req.session.user = user; // Configure session data for the newly logged in user
    
    return res.redirect(`/users/profile/${user.id}`);
  } catch (error) {~
    console.error(error)
    return res.redirect('/auth/login');
  }
}