import { Request, Response } from 'express';

import { getUserById } from '../services/user';
import * as Task from '../services/task';

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    const { description, deadline } = req.body

    let urgent = req.body.urgent
    if (/yes/i.test(urgent)) { urgent = true }

    const member = await getUserById(memberId)
    const adminId = req.session.user._id

    const newTask = await Task.createTask({
      member: memberId,
      project: projectId,
      assignedBy: adminId,
      deadline,
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
    const { description, urgent } = req.body

    const updatedTask = await Task.updateTask(taskId, { description, urgent })

    return res.status(200).json(updatedTask).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const submitTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const updatedTask = await Task.updateTask(taskId, { status: 'Awaiting Review' })

    return res.status(200).json(updatedTask).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const approveTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const updatedTask = await Task.updateTask(taskId, { status: 'Completed' })

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

    return res.status(200).json(tasksPerMember).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getSubmittedTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const submittedTasks = await Task.getSubmittedTasks(projectId)

    return res.status(200).json(submittedTasks).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createComment = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const { content } = req.body

    const newComment = await Task.createComment(taskId, {
      user: req.session.user._id,
      content
    })

    return res.status(200).json(newComment).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    const reply = await Task.replyComment(commentId, {
      user: req.session.user._id,
      content
    })

    return res.status(200).json(reply).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getCommentsPerTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const comments = await Task.getCommentsPerTask(taskId)

    return res.status(200).json(comments).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}