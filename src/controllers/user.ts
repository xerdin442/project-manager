import express from 'express';

import { getAll } from '../util/user';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getAll()

    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}