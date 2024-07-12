import express from 'express';

import { deleteUserById, getAll, getRemindersById, getMemberProjects, updateUser, getAdminProjects } from '../util/user';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getAll()

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
  
    const user = await updateUser(userId, { username, email })
  
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) 
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const deletedUser = await deleteUserById(userId)

    return res.status(200).json(deletedUser).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectsAsMember = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params
    const { member } = req.query

    if (member !== 'true') {
      return res.status(403).send('Not allowed to view projects')
    }

    const memberProjects = await getMemberProjects(userId)

    return res.status(200).json(memberProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectsAsAdmin = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params
    const { admin } = req.query

    if (admin !== 'true') {
      return res.status(403).send('Not allowed to view projects')
    }

    const adminProjects = await getAdminProjects(userId)

    return res.status(200).json(adminProjects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getReminders = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const reminders = await getRemindersById(userId)

    res.status(200).json(reminders).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}