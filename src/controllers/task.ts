import { Request, Response } from 'express';

import { getUserById } from '../services/user';
import * as Task from '../services/task';

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    const { description } = req.body

    let urgent = req.body.urgent
    if (/yes/i.test(urgent)) { urgent = true }

    const member = await getUserById(memberId)
    const adminId = req.session.user._id || req.user._id

    const newTask = await Task.createTask({
      member: memberId,
      project: projectId,
      assignedBy: adminId,
      description,
      urgent
    })
    await newTask.save()

    return res.status(200).json({ message: `Task has been assigned to ${member.username}`, task: newTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const { description, status, urgent } = req.body

    const updatedTask = await Task.updateTask(taskId, { description, status, urgent })

    return res.status(200).json(updatedTask).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params

    await Task.deleteTask(taskId)

    return res.status(200).json({ message: 'Task deleted successfully' }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getProjectTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const tasks = await Task.getProjectTasks(projectId)

    return res.status(200).json(tasks).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getTasksPerMember = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params

    const tasksPerMember = await Task.getTasksPerMember(memberId, projectId)

    res.status(200).json(tasksPerMember).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}