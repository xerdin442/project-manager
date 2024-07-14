import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import * as User from '../services/user'
import { addMember } from '../services/project'

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