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

export const updateProfile = (id: string, values: Record<string, any>) => {
  return User.findByIdAndUpdate(id, values, { new: true })
}

export const deleteUser = (id: string) => {
  return User.deleteOne({ _id: id });
}

export const getProjectsByRole = async (id: string, role: string) => {
  const projects = await Project.find()

  const projectsByRole = projects.filter(project => {
    return project.members.filter(member => id === member.user.toString() && role === member.role);
  })

  return projectsByRole;
}

export const getUserProjects = async (id: string) => {
  const projects = await Project.find()

  const userProjects = projects.filter(project => {
    return project.members.filter(member => id === member.user.toString());
  })

  return userProjects;
}

export const getReminders = async (id: string) => {
  const user = await getUserById(id)
  
  const reminders = user.reminders.map(async (reminder) => {
    const populatedReminder = await (await reminder.populate('project', 'name deadline')).populate('sender', 'username profileImage');

    return populatedReminder;
  })

  return reminders;
}