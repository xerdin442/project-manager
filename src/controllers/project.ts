import { Request, Response } from 'express';
import { Types } from 'mongoose';

import * as Project from '../services/project';
import { getUserById } from '../services/user';

export const getAll = async (req: Request, res: Response) => {
  try {
    const projects = await Project.getAll()
    if (!projects) {
      return res.status(400).json({ error: "An error occured while fetching all projects" })
    }

    return res.status(200).json({ projects }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const projectDetails = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const project = await Project.getprojectById(projectId)
    if (!project) {
      return res.status(400).json({ error: "An error occured while fetching project details" })
    }

    return res.status(200).json({ project }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, client, description, deadline } = req.body
    const userId = req.session.user.id

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
    })

    if (!project) {
      return res.status(400).json({ error: "An error occured while creating new project" })
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
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const { name, client, description, deadline } = req.body
    const project = await Project.updateProject(projectId, { name, client, description, deadline })
    if (!project) {
      return res.status(400).json({ error: "An error occured while updating project details" })
    }
    
    return res.status(200).json({ project }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const { status } = req.body
    const project = await Project.updateProject(projectId, { status })
    if (!project) {
      return res.status(400).json({ error: "An error occured while updating project status" })
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
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

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
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const members = await Project.getAllMembers(projectId)
    if (!members) {
      return res.status(400).json({ error: "An error occured while fetching all project members" })
    }

    return res.status(200).json({ members }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getMembersByRole = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }
    
    const { role } = req.query
    if (!role) {
      return res.sendStatus(403).json({ error: 'Invalid query parameter' })
    }

    const membersByRole = await Project.getMembersByRole(projectId, role as string)
    if (!membersByRole) {
      return res.status(400).json({ error: "An error occured while fetching members by role" })
    }

    if (role === 'admin') {
      return res.status(200).json({ admins: membersByRole }).end()
    } else if (role === 'member') {
      return res.status(200).json({ members: membersByRole }).end()
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid project ID or member ID" })
    }

    const member = await getUserById(memberId)
    const updatedAdmins = await Project.addAdmin(projectId, memberId)
    if (!updatedAdmins) {
      return res.status(400).json({ error: "An error occured while adding new project admin" })
    }

    return res.status(200).json({ message: `${member.username} is now an admin!`, admins: updatedAdmins }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid project ID or member ID" })
    }

    const updatedMembers = await Project.deleteMember(projectId, memberId)
    if (!updatedMembers) {
      return res.status(400).json({ error: "An error occured while deleting member" })
    }

    return res.status(200).json({ members: updatedMembers }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const sendReminder = async (req: Request, res: Response) => {
  try {
    const { memberId, projectId } = req.params
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid project ID or member ID" })
    }

    const { message } = req.body
    const senderId = req.session.user.id
    await Project.sendReminder(memberId, senderId, projectId, message)

    return res.status(200).json({ message: 'Your reminder has been sent!' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const addMember = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const { email } = req.body
    await Project.addMember(email, projectId)

    return res.status(200).json({ message: "New member successfully added to project" })
  } catch (error) {
   console.log(error)
   return res.sendStatus(500) 
  }
}

export const getProgress = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const progress = await Project.getProgress(projectId)

    if (progress === 0) {
      return res.status(200).json({ message: 'No tasks has been added to the project' }).end()
    } else {
      return res.status(200).json({ progress: `${progress}%` }).end()
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}