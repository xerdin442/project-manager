import { Request, Response, NextFunction } from 'express'

import { getAllMembers, getMembersByRole } from '../services/project'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session.user)) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  if (req.session.user._id.toString() !== userId) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  next()
}

export const isProjectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  const admins = await getMembersByRole(projectId, 'admin')
  const isAdmin = admins.some(admin => admin.user._id.toString() === req.session.user._id.toString())
  
  if (!isAdmin) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}

export const isProjectMember = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  const members = await getAllMembers(projectId)
  const isMember = members.some(member => member.user._id.toString() === req.session.user._id.toString())

  if (!isMember) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}

export const isProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  const admins = await getMembersByRole(projectId, 'admin')
  const isOwner = admins.some(admin => admin.user._id.toString() === req.session.user._id.toString() && admin.owner === true)

  if (!isOwner) {
    return res.status(403).send('Not authorized to perform this operation')
  }

  next()
}