import { Request, Response } from 'express';

import * as User from '../services/user';

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.getAll()
    if (!users) {
      return res.status(400).json({ message: "An error occured while fetching all users" })
    }

    return res.status(200).json(users).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    const user = await User.getUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "An error occured while fetching user details" })
    }

    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { username, email } = req.body
    let profileImage;

    if (req.file) {
      profileImage = req.file.path
    }

    const user = await User.updateProfile(userId, { username, email, profileImage })
    if (!user) {
      return res.status(400).json({ message: "An error occured while creating new user" })
    }
  
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) 
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
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

    const { role } = req.query
    if (!role) {
      return res.status(403).send('Not allowed to view projects')
    }

    const projectsByRole = await User.getProjectsByRole(userId, role as string)
    if (!projectsByRole) {
      return res.status(400).json({ message: "An error occured while fetching projects by role" })
    }

    return res.status(200).json(projectsByRole).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const userProjects = await User.getUserProjects(userId)
    if (!userProjects) {
      return res.status(400).json({ message: "An error occured while fetching user projects" })
    }

    return res.status(200).json(userProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getReminders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const reminders = await User.getReminders(userId)
    if (!reminders) {
      return res.status(400).json({ message: "An error occured while fetching reminders" })
    }

    return res.status(200).json(reminders).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const { userId, reminderId } = req.params
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

    const tasks = await User.getUserTasks(userId)
    if (!tasks) {
      return res.status(400).json({ message: "An error occured while fetching user tasks" })
    }

    res.status(200).json(tasks).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  } 
}

export const getTasksPerProject = async (req: Request, res: Response) => {
  try {
    const { projectId, userId } = req.params

    const tasksPerProject = await User.getTasksPerProject(userId, projectId)
    if (!tasksPerProject) {
      return res.status(400).json({ message: "An error occured while fetching tasks per project" })
    }

    res.status(200).json(tasksPerProject).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  } 
}