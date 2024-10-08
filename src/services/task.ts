import { Types } from 'mongoose';
import { ITask, Task, IComment, Comment } from '../models/task';

export const populateTask = async (task: ITask) => {
  const populatedTask = await Task.findById(task._id).populate([
    { path: 'project', select: '-inviteToken' },
    { path: 'assignedBy', select: 'username profileImage' },
    { path: 'member', select: 'username profileImage' }
  ]).exec();

  if (!populatedTask) {
    throw new Error('An error occured while fetching task details')
  }

  return populatedTask;
}

export const createTask = async (values: Record<string, any>) => {
  const task = new Task(values)
  if (!task) {
    throw new Error('An error occured while creating new task')
  }
  await task.save();

  const populatedTask = await populateTask(task)
  return populatedTask.toObject();
}

export const updateTask = async (id: string, values: Record<string, any>) => {
  const task = await Task.findByIdAndUpdate(id, values, { new: true })
  if (!task) {
    throw new Error('An error occured while updating task details')
  }

  return await populateTask(task);
}

export const deleteTask = (id: string) => {
  return Task.deleteOne({ _id: id });
}

export const getProjectTasks = async (projectId: string) => {
  const tasks = await Task.find({ project: projectId })
  if (!tasks) {
    throw new Error('An error occured while fetching all tasks')
  }
  const projectTasks = tasks.map(async task => await populateTask(task))

  return await Promise.all(projectTasks);
}

export const getTasksPerMember = async (memberId: string, projectId: string) => {
  const tasks = await getProjectTasks(projectId)
  const tasksPerMember = tasks.filter(task => task.member.equals(memberId))

  return tasksPerMember
}

export const getSubmittedTasks = async (projectId: string) => {
  const tasks = await getProjectTasks(projectId)
  const submittedTasks = tasks.filter(task => task.status === 'Awaiting Review')

  return submittedTasks;
}

export const populateComment = async (comment: IComment) => {
  // Populate the user field with username and profile image
  const populatedComment = await Comment.findById(comment.id).populate('user', 'username profileImage').exec();
  if (!populatedComment) {
    throw new Error('An error occured while fetching comment details')
  }

  // Recursively populate the replies and sub-replies of the comment
  if (populatedComment.replies.length !== 0) {
    populatedComment.replies = await Promise.all(populatedComment.replies.map(async replyId => {
      const reply = await Comment.findById(replyId);
      return await populateComment(reply);
    }));
  }

  return populatedComment;
};

export const createComment = async (taskId: string, values: Record<string, any>) => {
  const comment = new Comment(values)
  if (!comment) {
    throw new Error('An error occured while creating new comment')
  }
  await comment.save();

  // Find the task and append the comment to the task's comments array
  const task = await Task.findById(taskId)
  if (!task) {
    throw new Error('Task not found')
  }
  task.comments.push(comment._id as Types.ObjectId)
  await task.save()

  return await populateComment(comment)
}

export const replyComment = async (commentId: string, values: Record<string, any>) => {
  const reply = new Comment(values)
  if (!reply) {
    throw new Error('An error occured. Reply could not be saved')
  }
  await reply.save()

  // Find the parent comment and add the reply id to the comment's replies array
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }
  comment.replies.push(reply._id as Types.ObjectId)
  await comment.save()

  return await populateComment(reply);
}

export const getCommentsPerTask = async (taskId: string) => {
  const task = await Task.findById(taskId)
  if (!task) {
    throw new Error('Task not found')
  }

  const comments = task.comments.map(async commentId => {
    const comment = await Comment.findById(commentId.toString())
    return await populateComment(comment)
  })

  return await Promise.all(comments);
}