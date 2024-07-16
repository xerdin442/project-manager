import { ITask, Task } from '../models/task';

export const populateTask = async (task: ITask) => {
  const populatedTask = await Task.findById(task._id).populate([
    'project',
    { path: 'assignedBy', select: 'username profileImage' },
    { path: 'member', select: 'username profileImage' }
  ]).exec()

  return populatedTask;
}

export const createTask = async (values: Record<string, any>) => {
  const task = new Task(values)
  await task.save();
  
  const populatedTask = await populateTask(task)
  
  return populatedTask.toObject();
}

export const updateTask = async (id: string, values: Record<string, any>) => {
  const task = await Task.findByIdAndUpdate(id, values, { new: true })

  return await populateTask(task);
}

export const deleteTask = (id: string) => {
  return Task.deleteOne({ _id: id });
}

export const getProjectTasks = async (projectId: string) => {
  const tasks = await Task.find({ project: projectId })

  const projectTasks = tasks.map(async task => await populateTask(task))

  return await Promise.all(projectTasks);
}

export const getTasksPerMember = async (memberId: string, projectId: string) => {
  const tasks = await getProjectTasks(projectId)

  const tasksPerMember = tasks.filter(task => task.member.equals(memberId)).map(async task => await populateTask(task))

  return await Promise.all(tasksPerMember)
}