import express from 'express';

import { deleteUserById, getAll, getRemindersById, getUserProjectsById, updateUser } from '../util/user';

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

export const getUserProjects = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    const userProjects = await getUserProjectsById(userId)

    return res.status(200).json(userProjects).end()
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