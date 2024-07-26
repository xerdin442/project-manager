import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { getUserById } from '../services/user';
import * as Task from '../services/task';
import { sendReminder } from '../services/project';

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid project ID or member ID" })
    }

    const { description, deadline, urgent } = req.body
    
    const member = await getUserById(memberId)
    if (!member) {
      return res.status(400).json({ error: "An error occured while fetching member by ID" })
    }

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

    if (!newTask) {
      return res.status(400).json({ error: "An error occured while creating new task" })
    }

    return res.status(200).json({ message: `Task has been assigned to ${member.username}`, task: newTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const { description, urgent, deadline } = req.body
    const updatedTask = await Task.updateTask(taskId, { description, urgent, deadline })
    if (!updatedTask) {
      return res.status(400).json({ error: "An error occured while updating task details" })
    }

    return res.status(200).json({ message: "Task details updated successfully!", task: updatedTask }).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const submitTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const updatedTask = await Task.updateTask(taskId, { status: 'Awaiting Review' })
    if (!updatedTask) {
      return res.status(400).json({ error: "An error occured while updating task status" })
    }

    if (!Types.ObjectId.isValid(updatedTask.assignedBy._id) || !Types.ObjectId.isValid(updatedTask.project._id)) {
      return res.status(400).json({ error: "Error while sending reminder, invalid assignee ID or project ID" })
    }

    const receiver = updatedTask.assignedBy._id.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project._id.toString()
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
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const updatedTask = await Task.updateTask(taskId, { status: 'Completed' })
    if (!updatedTask) {
      return res.status(400).json({ error: "An error occured while updating task status" })
    }

    if (!Types.ObjectId.isValid(updatedTask.member._id) || !Types.ObjectId.isValid(updatedTask.project._id)) {
      return res.status(400).json({ error: "Error occured while sending reminder, invalid member ID or project ID" })
    }

    const receiver = updatedTask.member._id.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project._id.toString()
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
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const updatedTask = await Task.updateTask(taskId, { status: 'To-do' })
    if (!updatedTask) {
      return res.status(400).json({ error: "An error occured while updating task status" })
    }

    if (!Types.ObjectId.isValid(updatedTask.member._id) || !Types.ObjectId.isValid(updatedTask.project._id)) {
      return res.status(400).json({ error: "Error occured while sending reminder, invalid member ID or project ID" })
    }

    const receiver = updatedTask.member._id.toString()
    const sender = req.session.user._id.toString()
    const project = updatedTask.project._id.toString()
    const taskInfo = updatedTask.description.slice(0, 35)
    const message = `"${taskInfo}..."
      Task has been rejected. Check task comments to see the reasons!`
    
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
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

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
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" })
    }

    const tasks = await Task.getProjectTasks(projectId)
    if (!tasks) {
      return res.status(400).json({ error: "An error occured while fetching project tasks" })
    }

    return res.status(200).json(tasks).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getTasksPerMember = async (req: Request, res: Response) => {
  try {
    const { projectId, memberId } = req.params
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid project ID or member ID" })
    }

    const tasksPerMember = await Task.getTasksPerMember(memberId, projectId)
    if (!tasksPerMember) {
      return res.status(400).json({ error: "An error occured while fetching tasks per member" })
    }

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
    if (!submittedTasks) {
      return res.status(400).json({ error: "An error occured while fetching all submitted tasks" })
    }

    return res.status(200).json(submittedTasks).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createComment = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const { content } = req.body
    const newComment = await Task.createComment(taskId, {
      user: req.session.user._id,
      content
    })

    if (!newComment) {
      return res.status(400).json({ error: "An error occured while creating a new comment" })
    }

    return res.status(200).json(newComment).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    if (!Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const { content } = req.body
    const reply = await Task.replyComment(commentId, {
      user: req.session.user._id,
      content
    })

    if (!reply) {
      return res.status(400).json({ error: "An error occured while replying comment" })
    }

    return res.status(200).json(reply).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getCommentsPerTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }
    
    const comments = await Task.getCommentsPerTask(taskId)
    if (!comments) {
      return res.status(400).json({ error: "An error occured while fetching comments per task" })
    }

    return res.status(200).json(comments).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}