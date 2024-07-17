import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import * as User from '../services/user'
import { addMember } from '../services/project'
import { sendEmail } from '../util/mail'
import { getGoogleAuthUrl, handleGoogleCallback } from '../config/authentication'

export const register = async (req: Request, res: Response) => {
  try {
    let { username, email, password, profileImage } = req.body // Extract required fields from request body

    if (!email || !password || !username) {
      return res.status(400).send('All fields are required') // Send an error message if any of the required fields are missing
    }

    if (!req.file) {
      profileImage = process.env.DEFAULT_IMAGE
    } else {
      profileImage = req.file.path
    }

    // Resizing of images***

    const existingUser = await User.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).send('User with that email already exits') // Send an error message if user with that email already exists
    }

    // If all the checks are successful, create a new user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.createUser({
      email,
      username,
      password: hashedPassword,
      profileImage
    })

    return res.status(200).json(user).end() // Send success message and user information
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

    req.session.user = user // Configure session data for newly logged in user

    /* When a user is redirected to the login page after clicking an invite,
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
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }

    return res.status(200).json({ message: 'You logged out' })
  })
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
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
    return res.status(200).json({ message: 'A reset token has been sent to your email' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered
  }
}

export const checkResetToken = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.body

    const user = await User.checkResetToken(resetToken)
    // Check if reset token is valid
    if (!user) {
      return res.status(400).send('Invalid reset token')
    }

    const currentTime = new Number(Date.now())
    // Check if reset token has expired
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

    const redirectURL = `http://localhost:3000/api/auth/change-password?resetToken=${user.resetToken}`
    
    return res.status(200).json({ redirectURL })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered      
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
    return res.status(200).json({ message: 'Another token has been sent to your email' })
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
      return res.status(400).send('Invalid reset token') // Send error message if reset token is invalid
    }
  
    // If reset token is valid, change password, reset the token value and save changes
    const hashedPassword = await bcrypt.hash(password, 12)  
    user.password = hashedPassword
    user.resetToken = undefined
    await user.save()
  
    return res.status(200).send({ message: 'Password has been reset' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Send an error message if any server errors are encountered 
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