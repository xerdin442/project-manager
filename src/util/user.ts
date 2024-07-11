import { User } from '../models/user';
import { Project } from '../models/project';

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

export const updateUser = (id: string, values: Record<string, any>) => {
  return User.findByIdAndUpdate(id, values, { new: true })
}

export const deleteUserById = (id: string) => {
  return User.deleteOne({ _id: id });
}

export const getUserProjectsById = async (id: string) => {
  const projects = await Project.find()

  const userProjects = projects.filter(project => {
    return project.members.filter(member => id === member.user.toString());
  })

  return userProjects;
}

export const getRemindersById = async (id: string) => {
  const user = await getUserById(id)
  
  const reminders = user.reminders.map(async (reminder) => {
    const populatedReminder = await (await reminder.populate('sender', 'username profileImage')).populate('project', 'name deadline');

    return populatedReminder;
  })

  return reminders;
}