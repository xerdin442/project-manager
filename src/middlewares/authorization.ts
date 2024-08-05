import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken';

import { getAllMembers, getMembersByRole } from '../services/project'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'] // Extract the header value
  if (!header) {
    return res.status(400).json({ error: "Access denied. Invalid header!" })
  }

  const authorization = header as string // Cast header value as a string
  const token = authorization.split(' ')[1] // Extract token value from header string value
  if (!token) {
    return res.status(400).json({ error: "Access denied. Invalid token!" })
  }

  try {
    // Verify and extract payload from authorization token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload) {
      return res.status(400).json({ error: "Access denied. An error occured while verifying token!" })
    }

    req.session.user = payload as JwtPayload // Initialize a new session using the extracted payload data
    next()
  } catch (error) {
    // Check if the token has expired and prompt the user to login
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Your session has expired. Log in to continue" });
    } else {
      console.log(error)
      return res.sendStatus(500)
    }
  }
}

export const isProjectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Get all the project admins and check if the logged in user is an admin
  const admins = await getMembersByRole(projectId, 'admin')
  const isAdmin = admins.some(admin => admin.user._id.toString() === req.session.user.id)

  if (!isAdmin) {
    return res.status(403).json({ error: 'Not authorized. Only project admins can perform this operation' })
  }

  next()
}

export const isProjectMember = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Get all the project members and check if the logged in user is a member
  const members = await getAllMembers(projectId)
  const isMember = members.some(member => member.user._id.toString() === req.session.user.id)

  if (!isMember) {
    return res.status(403).json({ error: 'Not authorized. Only project members can perform this operation' })
  }

  next()
}

export const isProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Check if the logged in user is the project owner
  const admins = await getMembersByRole(projectId, 'admin')
  const isOwner = admins.some(admin => admin.user._id.toString() === req.session.user.id && admin.owner === true)

  if (!isOwner) {
    return res.status(403).json({ error: 'Not authorized. Only the project owner can perform this operation' })
  }

  next()
}