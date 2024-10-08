import { User } from '../models/user';
import { Project } from '../models/project';
import { Task } from '../models/task';
import { populateTask } from './task';
import { populateProject } from './project';

export const getAll = () => {
  return User.find()
}

export const getUserById = (id: string) => {
  return User.findById(id)
}

export const getUserByEmail = (email: string) => {
  return User.findOne({ email });
}

export const createUser = async (values: Record<string, any>) => {
  const user = new User(values)
  if (!user) {
    throw new Error('An error occured while creating new user')
  }
  await user.save();
  
  return user.toObject();
}

export const updateProfile = (id: string, values: Record<string, any>) => {
  return User.findByIdAndUpdate(id, values, { new: true })
}

export const deleteUser = (id: string) => {
  return User.deleteOne({ _id: id });
}

export const getProjectsByRole = async (id: string, role: string) => {
  const projects = await Project.find()
  if (!projects) {
    throw new Error('An error occured while fetching all projects')
  }

  const projectsByRole = projects.filter(project => {
    return project.members.filter(member => member.user.equals(id) && role === member.role);
  }).map(async p => {
    const project = await populateProject(p)
    return project;
  })

  return await Promise.all(projectsByRole);
}

export const getUserProjects = async (id: string) => {
  const projects = await Project.find()
  if (!projects) {
    throw new Error('An error occured while fetching all projects')
  }

  const userProjects = projects.filter(project => {
    return project.members.filter(member => member.user.equals(id));
  }).map(async p => {
    const project = await populateProject(p)
    return project;
  })

  return await Promise.all(userProjects);
}

export const getReminders = async (id: string) => {
  const user = await getUserById(id).populate([
    { path: 'reminders.project', select: 'name deadline' },
    { path: 'reminders.sender', select: 'username profileImage' }
  ]).exec()

  if (!user) {
    throw new Error('An error occured while fetching reminders')
  }

  return user.reminders;
}

export const deleteReminder = async (userId: string, reminderId: string) => {
  const user = await getUserById(userId)
  user.reminders = user.reminders.filter(reminder => reminder._id.toString() !== reminderId)
  
  return user.save()
}

export const checkResetToken = async (resetToken: string) => {
  const token = Number(resetToken)
  return User.findOne({ resetToken: token }).select('+password')
}

export const getUserTasks = async (id: string) => {
  const tasks = await Task.find({ member: id })
  if (!tasks) {
    throw new Error('An error occured while fetching all user tasks')
  }
  const populatedTasks = tasks.map(async task => await populateTask(task))

  return await Promise.all(populatedTasks);
}

export const getTasksPerProject = async (userId: string, projectId: string) => {
  const tasks = await getUserTasks(userId)
  const tasksPerProject = tasks.filter(task => task.project.equals(projectId))

  return tasksPerProject;
}