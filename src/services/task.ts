import { Task } from '../models/task';

export const getAll = () => {
  return Task.find()
}

export const getTaskById = (id: string) => {
  return Task.findById(id)
}

export const createTask = async (values: Record<string, any>) => {
  const taTaskDoc = new Task(values)

  const taTask = await taTaskDoc.save();
  return taTask.toObject();
}

export const updateTask = (id: string, values: Record<string, any>) => {
  return Task.findByIdAndUpdate(id, values, { new: true })
}

export const deleteTask = (id: string) => {
  return Task.deleteOne({ _id: id });
}