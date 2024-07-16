import { Request, Response, NextFunction } from 'express'

import { getAllMembers, getMembersByRole } from '../services/project'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session.user || req.user)) {
    return res.redirect('/auth/login')
  }

  next()
}

export const isProjectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  const admins = await getMembersByRole(projectId, 'admin')
  const isAdmin = admins.some(admin => admin.user.equals(req.session.user._id || req.user.id))
  
  if (!isAdmin) {
    return res.status(400).send('Not authorized to perform this operation')
  }

  next()
}

export const isProjectMember = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params

  const members = await getAllMembers(projectId)
  const isMember = members.some(member => member.user.equals(req.session.user._id || req.user.id))
  
  if (!isMember) {
    return res.status(400).send('Not authorized to perform this operation')
  }

  next()
}