import { Request, Response, NextFunction } from 'express'

import { getAllMembers, getMembersByRole } from '../services/project'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // Check if there is a logged in user
  if (!(req.session.user)) {
    return res.status(401).json({ message: "You are not logged in" })
  }

  next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  // Check if there is a logged in user
  if (req.session.user) {
    // Check if the logged in user is the same as the user requesting to perform the operation
    if (req.session.user._id.toString() !== userId) {
      return res.status(401).json({ message: "Not authenticated to perform this operation" })
    }
  } else {
    return res.status(401).json({ message: "You are not logged in" })
  }

  next()
}

export const isProjectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Get all the project admins and check if the logged in user is an admin
  const admins = await getMembersByRole(projectId, 'admin')
  const isAdmin = admins.some(admin => admin.user._id.toString() === req.session.user._id.toString())
  
  if (!isAdmin) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}

export const isProjectMember = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Get all the project members and check if the logged in user is a member
  const members = await getAllMembers(projectId)
  const isMember = members.some(member => member.user._id.toString() === req.session.user._id.toString())

  if (!isMember) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}

export const isProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  // Check if the logged in user is the project owner
  const admins = await getMembersByRole(projectId, 'admin')
  const isOwner = admins.some(admin => admin.user._id.toString() === req.session.user._id.toString() && admin.owner === true)

  if (!isOwner) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}