import { Project } from '../models/project';
import { getUserById } from './user';

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
  const updatedMembers = Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: { user: userId } } },
    { new: true }
  )

  return updatedMembers
}

export const addAdmin = async (projectId: string, userId: string) => {
  const project = await getprojectById(projectId)

  const userIndex = project.members.findIndex(member => userId === member.user.toString())
  project.members[userIndex].role = 'admin'

  await project.save()

  return getMembersByRole(projectId, 'admin')
}

export const addPhase = async (projectId: string) => {
  const project = await getprojectById(projectId)
}

export const sendReminder = async (memberId: string, senderId: string, projectId: string, message: string) => {
  const member = await getUserById(memberId)

  member.reminders.push({
    project: projectId,
    sender: senderId,
    message: message
  })

  return member.save()
}
//send invite
//accept invite
//add phase
//delete phase