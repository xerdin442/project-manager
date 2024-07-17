import { Request, Response } from 'express';
import { v4 as generateToken } from 'uuid';

import * as Project from '../services/project';

export const getAll = async (req: Request, res: Response) => {
  try {
    const projects = await Project.getAll()

    return res.status(200).json(projects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const projectDetails = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const project = await Project.getprojectById(projectId)

    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, client, description, deadline } = req.body
    const token = generateToken()
    const userId = req.user._id || req.session.user._id

    const project = Project.createProject({
      name,
      members: [{
        user: userId,
        role: "admin"
      }],
      client,
      description,
      deadline,
      inviteToken: token
    })

    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { name, client, description, deadline } = req.body

    const project = await Project.updateProject(projectId, { name, client, description, deadline })
    
    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { status } = req.body

    const project = await Project.updateProject(projectId, { status })
    
    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    await Project.deleteProject(projectId)

    return res.status(200).json({ message: 'Project deleted successfully' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const members = await Project.getAllMembers(projectId)

    return res.status(200).json(members).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { role } = req.query

    if (role !== 'member') {
      return res.sendStatus(403)
    }

    const projectMembers = await Project.getMembersByRole(projectId, role)

    return res.status(200).json(projectMembers).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { role } = req.query

    if (role !== 'admin') {
      return res.sendStatus(403)
    }

    const projectAdmins = await Project.getMembersByRole(projectId, role)

    return res.status(200).json(projectAdmins).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params

    const updatedAdmins = await Project.addAdmin(projectId, memberId)

    return res.status(200).json(updatedAdmins).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params

    const updatedMembers = await Project.deleteMember(projectId, memberId)

    return res.status(200).json(updatedMembers).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const sendReminder = async (req: Request, res: Response) => {
  try {
    const { memberId, projectId } = req.params
    const { message } = req.body
    const senderId = req.session.user.id || req.user.id

    await Project.sendReminder(memberId, senderId, projectId, message)

    return res.status(200).json({ message: 'Your reminder has been sent!' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getInviteLink = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const inviteLink = await Project.getInviteLink(projectId)
  
    return res.status(200).json(inviteLink).end()  
  } catch (error) {
   console.log(error)
   return res.sendStatus(500) 
  }
}

export const acceptInvite = async (req: Request, res: Response) => {
  const { inviteToken } = req.params

  return res.redirect(`/api/auth/login?inviteToken=${inviteToken}`)
}

export const getProgress = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const progress = await Project.getProgress(projectId)

    return res.status(200).json(progress).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}