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
  return User.findOne({ email: email });
}

export const createUser = async (values: Record<string, any>) => {
  const user = new User(values)
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

  return user.reminders;
}

export const checkResetToken = async (resetToken: string) => {
  const user = await User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() } // Check if token expiration date is higher than current date
  }).select('+password')

  return user;
}

export const getUserTasks = async (id: string) => {
  const tasks = await Task.find({ member: id })
  const populatedTasks = tasks.map(async task => await populateTask(task))

  return await Promise.all(populatedTasks);
}

export const getTasksPerProject = async (userId: string, projectId: string) => {
  const tasks = await getUserTasks(userId)
  const tasksPerProject = tasks.filter(task => task.project.equals(projectId))

  return tasksPerProject;
}