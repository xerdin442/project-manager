import { Request, Response } from 'express';

import * as Project from '../services/project';

export const getAll = async (req: Request, res: Response) => {
  try {
    const projects = await Project.getAll()
    if (!projects) {
      return res.status(400).json({ message: "An error occured while fetching all projects" })
    }

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
    if (!project) {
      return res.status(400).json({ message: "An error occured while fetching project details" })
    }

    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, client, description, deadline } = req.body
    const token = Math.ceil(Math.random() * 10 ** 6)
    const userId = req.session.user._id

    const project = await Project.createProject({
      name,
      members: [{
        user: userId,
        role: "admin",
        owner: true
      }],
      client,
      description,
      deadline,
      inviteToken: token
    })
    if (!project) {
      return res.status(400).json({ message: "An error occured while creating new project" })
    }

    return res.status(200).json({ project }).end()
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
    if (!project) {
      return res.status(400).json({ message: "An error occured while updating project details" })
    }
    
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
    if (!project) {
      return res.status(400).json({ message: "An error occured while updating project status" })
    }
    
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
    if (!members) {
      return res.status(400).json({ message: "An error occured while fetching all project members" })
    }

    return res.status(200).json(members).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getMembersByRole = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    
    const { role } = req.query
    if (!role) {
      return res.sendStatus(403).send('Role is not provided')
    }

    const membersByRole = await Project.getMembersByRole(projectId, role as string)
    if (!membersByRole) {
      return res.status(400).json({ message: "An error occured while fetching members by role" })
    }

    return res.status(200).json(membersByRole).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params

    const updatedAdmins = await Project.addAdmin(projectId, memberId)
    if (!updatedAdmins) {
      return res.status(400).json({ message: "An error occured while adding new project admin" })
    }

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
    if (!updatedMembers) {
      return res.status(400).json({ message: "An error occured while deleting member" })
    }

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
    const senderId = req.session.user._id.toString()

    await Project.sendReminder(memberId, senderId, projectId, message, res)

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
    if (!inviteLink) {
      return res.status(400).json({ message: "An error occured while getting project invite link" })
    }
  
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
    if (!progress) {
      return res.status(400).json({ message: "An error occured while fetching the progress of the project" })
    }

    return res.status(200).json({ progress: `${progress}%` }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}