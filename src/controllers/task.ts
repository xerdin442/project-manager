import { Request, Response } from 'express';

import { getUserById } from '../services/user';
import * as Task from '../services/task';
import { sendReminder } from '../services/project';

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    const { description, deadline, urgent } = req.body
    
    const member = await getUserById(memberId)
    const adminId = req.session.user._id
    const isUrgent = /yes/i.test(urgent);

    const newTask = await Task.createTask({
      member: memberId,
      project: projectId,
      assignedBy: adminId,
      deadline,
      description,
      urgent: isUrgent
    })

    return res.status(200).json({ message: `Task has been assigned to ${member.username}`, task: newTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const { description, urgent, deadline } = req.body

    const updatedTask = await Task.updateTask(taskId, { description, urgent, deadline })

    return res.status(200).json({ message: "Task details updated successfully!", task: updatedTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const submitTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const updatedTask = await Task.updateTask(taskId, { status: 'Awaiting Review' })

    const receiver = updatedTask.assignedBy.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project.toString()
    const taskInfo = updatedTask.description.slice(0, 35)
    const message = `"${taskInfo}..."
      New task has been submitted, awaiting your review`

    await sendReminder(receiver, sender, project, message)

    return res.status(200).json({ message: "Task submitted successfully, awaiting review...", task: updatedTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const approveTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const updatedTask = await Task.updateTask(taskId, { status: 'Completed' })

    const receiver = updatedTask.member.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project.toString()
    const taskInfo = updatedTask.description.slice(0, 35)
    const message = `"${taskInfo}..."
      Task has been approved. Start working on the next!`

    await sendReminder(receiver, sender, project, message)

    return res.status(200).json({ message: "Task has been approved and marked as 'Completed'", task: updatedTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const rejectTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const updatedTask = await Task.updateTask(taskId, { status: 'To-do' })

    const receiver = updatedTask.member.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project.toString()
    const taskInfo = updatedTask.description.slice(0, 35)
    const message = `"${taskInfo}..."
      Task has been rejected. Check comments to see the reasons!`
    
    await sendReminder(receiver, sender, project, message)

    return res.status(200).json({ message: "Task has been rejected. Leave a comment on the reason for rejection", task: updatedTask }).end()
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