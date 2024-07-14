import mongoose from 'mongoose';
import { Request, Response } from 'express';

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

  const userIndex = project.members.findIndex(member => member.user.equals(userId))
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
    project: new mongoose.Types.ObjectId(projectId),
    sender: new mongoose.Types.ObjectId(senderId),
    message: message
  })

  return member.save()
}

export const getInviteLink = async (projectId: string) => {
  const project = await getprojectById(projectId)
  const inviteLink = `http://localhost:3000/api/projects/${project.id}/invite/${project.inviteToken}`

  return inviteLink;
}

export const addMember = async (inviteToken: string, req: Request, res: Response) => {
  const project = await Project.findOne({ inviteToken })
  if (project) {
    const userId = req.session.user._id || req.user.id

    // Check if the user is already a member
    const isMember = project.members.some(member => member.user.equals(userId));
    if (!isMember) {
      project.members.push({ user: userId, role: 'member' });
      await project.save();

      return res.status(200).json({ message: `You have joined ${project.name} as a member!` }).end()
    } else {
      return res.status(400).send('You are already a member of this project')
    }
  } else {
    return res.status(400).send('Project not found')
  }
}
//delete phase