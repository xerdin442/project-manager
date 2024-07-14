import { User } from '../models/user';
import { Project } from '../models/project';
import { Task } from '../models/task';

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
  const userDoc = new User(values)

  const user = await userDoc.save();
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
  })

  return projectsByRole;
}

export const getUserProjects = async (id: string) => {
  const projects = await Project.find()

  const userProjects = projects.filter(project => {
    return project.members.filter(member => member.user.equals(id));
  })

  return userProjects;
}

export const getReminders = async (id: string) => {
  const user = await getUserById(id)

  await user.populate([
    { path: 'reminders.project', select: 'name deadline' },
    { path: 'reminders.sender', select: 'username profileImage' }
  ])

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
  return Task.find({ user: id })
}

export const getTasksPerProject = async (userId: string, projectId: string) => {
  const tasks = await getUserTasks(userId)

  const tasksPerProject = tasks.filter(task => task.project.equals(projectId))

  return tasksPerProject;
}