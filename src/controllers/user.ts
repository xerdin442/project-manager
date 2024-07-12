import express from 'express';

import * as User from '../util/user';

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.getAll()

    return res.status(200).json(users).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateProfile = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params
    const { username, email } = req.body
    // Image logic
  
    const user = await User.updateProfile(userId, { username, email })
  
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) 
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const deletedUser = await User.deleteUser(userId)

    return res.status(200).json(deletedUser).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectsAsMember = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params
    const { role } = req.query

    if (role !== 'member') {
      return res.status(403).send('Not allowed to view projects')
    }

    const memberProjects = await User.getProjectsByRole(userId, role)

    return res.status(200).json(memberProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectsAsAdmin = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params
    const { role } = req.query

    if (role !== 'admin') {
      return res.status(403).send('Not allowed to view projects')
    }

    const adminProjects = await User.getProjectsByRole(userId, role)

    return res.status(200).json(adminProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getUserProjects = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const userProjects = await User.getUserProjects(userId)

    res.status(200).json(userProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getReminders = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const reminders = await User.getReminders(userId)

    res.status(200).json(reminders).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}