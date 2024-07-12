import user from 'src/routes/user';
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

export const updateProject = (id: string, values: Record<string, any>) => {
  return Project.findByIdAndUpdate(id, values, { new: true })
}

export const deleteProject = (id: string) => {
  return Project.deleteOne({ _id: id });
}

export const getMembersByRole = async (id: string, role: string) => {
  const project = await getprojectById(id)

  const membersByRole = project.members.filter(member => role === member.role);

  return membersByRole
}

export const getAllMembers = async (id: string) => {
  const project = await getprojectById(id)

  return project.members
}

export const deleteMember = async (projectId: string, userId: string) => {
  const updatedMembers = Project.findByIdAndUpdate(projectId,
    { $pull: { members: { user: userId } } },
    { new: true }
  )

  return updatedMembers
}

export const addAdmin = async (projectId: string, userId: string) => {
  const project = await getprojectById(projectId)

  await project.addAdmin(userId)

  return getMembersByRole(projectId, 'admin')
}

//send invite
//accept invite
//add phase
//delete phase
//update status