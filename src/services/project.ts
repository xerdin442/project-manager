import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { Project, IProject } from '../models/project';
import { getUserById } from './user';
import { getProjectTasks } from './task';

export const getAll = () => {
  return Project.find()
}

export const getprojectById = (id: string) => {
  return Project.findById(id)
}

export const populateProject = async (project: IProject) => {
  const populatedProject = await Project.findById(project._id)
  .populate({ path: 'members.user', select: 'username profileImage' }).exec()
  
  return populatedProject;
}

export const createProject = async (values: Record<string, any>) => {
  const project = new Project(values)
  await project.save();

  const populatedProject = await populateProject(project)
  
  return populatedProject.toObject();
}

export const updateProject = async (id: string, values: Record<string, any>) => {
  const project = await Project.findByIdAndUpdate(id, values, { new: true })

  return await populateProject(project)
}

export const deleteProject = (id: string) => {
  return Project.deleteOne({ _id: id });
}

export const getMembersByRole = async (id: string, role: string) => {
  const project = await getprojectById(id)
  const populatedProject = await populateProject(project)
  const membersByRole = populatedProject.members.filter(member => role === member.role);

  return membersByRole;
}

export const getAllMembers = async (id: string) => {
  const project = await getprojectById(id)
  const populatedProject = await populateProject(project)

  return populatedProject.members;
}

export const deleteMember = async (projectId: string, userId: string) => {
  const project = await updateProject(projectId, { $pull: { members: { user: userId } } })
  const updatedProject = await populateProject(project)

  return updatedProject.members;
}

export const addAdmin = async (projectId: string, userId: string) => {
  const project = await getprojectById(projectId)

  const userIndex = project.members.findIndex(member => member.user.equals(userId))
  project.members[userIndex].role = 'admin'
  await project.save()

  return await getMembersByRole(projectId, 'admin');
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

export const getProgress = async (projectId: string) => {
  const tasks = await getProjectTasks(projectId)

  const completedTasks = tasks.filter(task => task.status === 'Completed')
  const progress = (completedTasks.length / tasks.length) * 100

  return Math.ceil(progress);
}