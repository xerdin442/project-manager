import { Project } from '../models/project';

export const getAll = () => {
  return Project.find()
}

export const getprojectById = (id: string) => {
  return Project.findById(id)
}

export const createProject = async (values: Record<string, any>) => {
  const projectDoc = new Project(values)

  const project = await projectDoc.save();
  return project.toObject();
}

export const deleteProjectById = (id: string) => {
  return Project.deleteOne({ _id: id });
}

export const getAllMembers = async (id: string) => {
  const project = await getprojectById(id)

  return project.members
}