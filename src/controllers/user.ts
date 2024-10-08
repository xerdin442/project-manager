import { Request, Response } from 'express';
import { Types } from 'mongoose';

import * as User from '../services/user';

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.getAll()
    if (!users) {
      return res.status(400).json({ error: "An error occured while fetching all users" })
    }

    return res.status(200).json({ users }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }
    
    const user = await User.getUserById(userId)
    if (!user) {
      return res.status(400).json({ error: "An error occured while fetching user details" })
    }

    return res.status(200).json({ user }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const { username, email } = req.body
    let profileImage;

    if (req.file) {
      profileImage = req.file.path
    }

    const user = await User.updateProfile(userId, { username, email, profileImage })
    if (!user) {
      return res.status(400).json({ error: "An error occured while updating user profile" })
    }
  
    return res.status(200).json({ user }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) 
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    await User.deleteUser(userId)

    return res.status(200).json({ message: 'User successfully deleted' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectsByRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const { role } = req.query
    if (!role) {
      return res.status(403).json({ error: 'Invalid query parameter' })
    }

    const projectsByRole = await User.getProjectsByRole(userId, role as string)
    if (!projectsByRole) {
      return res.status(400).json({ error: "An error occured while fetching projects by role" })
    }

    if (role === 'admin') {
      return res.status(200).json({ projectsAsAdmin: projectsByRole }).end()
    } else if (role === 'member') {
      return res.status(200).json({ projectsAsMember: projectsByRole }).end()
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const userProjects = await User.getUserProjects(userId)
    if (!userProjects) {
      return res.status(400).json({ error: "An error occured while fetching user projects" })
    }

    return res.status(200).json({ projects: userProjects }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getReminders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const reminders = await User.getReminders(userId)
    if (!reminders) {
      return res.status(400).json({ error: "An error occured while fetching reminders" })
    }

    return res.status(200).json({ reminders }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const { userId, reminderId } = req.params
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid user ID or reminder ID" })
    }

    await User.deleteReminder(userId, reminderId)

    return res.status(200).json({ message: "Reminder successfully deleted!" }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const tasks = await User.getUserTasks(userId)
    if (!tasks) {
      return res.status(400).json({ error: "An error occured while fetching user tasks" })
    }

    res.status(200).json({ tasks }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  } 
}

export const getTasksPerProject = async (req: Request, res: Response) => {
  try {
    const { projectId, userId } = req.params
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid user ID or project ID" })
    }

    const tasksPerProject = await User.getTasksPerProject(userId, projectId)
    if (!tasksPerProject) {
      return res.status(400).json({ error: "An error occured while fetching tasks per project" })
    }

    res.status(200).json({ tasks: tasksPerProject }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  } 
}