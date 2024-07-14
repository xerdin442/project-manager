import { Task } from '../models/task';

export const getAll = () => {
  return Task.find()
}

export const getTaskById = (id: string) => {
  return Task.findById(id)
}

export const createTask = async (values: Record<string, any>) => {
  const task = new Task(values)
  await task.save();
  
  return task.toObject();
}

export const updateTask = (id: string, values: Record<string, any>) => {
  return Task.findByIdAndUpdate(id, values, { new: true })
}

export const deleteTask = (id: string) => {
  return Task.deleteOne({ _id: id });
}

export const getProjectTasks = async (projectId: string) => {
  return Task.find({ project: projectId })
}

export const getTasksPerMember = async (memberId: string, projectId: string) => {
  const tasks = await getProjectTasks(projectId)

  const tasksPerMember = tasks.filter(task => task.project.equals(memberId))

  return tasksPerMember;
}