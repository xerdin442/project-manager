import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { Project, IProject } from '../models/project';
import { getProjectTasks } from './task';
import { User } from '../models/user';

export const populateProject = async (project: IProject) => {
  const populatedProject = await Project.findById(project._id)
  .populate({ path: 'members.user', select: 'username profileImage' }).exec()

  if (!populatedProject) {
    throw new Error('An error occured while fetching project details')
  }
  
  return populatedProject;
}

export const getAll = async () => {
  const projects = await Project.find()
  if (!projects) {
    throw new Error('An error occured while fetching all projects')
  }
  const populatedProjects = projects.map(async project => await populateProject(project))

  return await Promise.all(populatedProjects);
}

export const getprojectById = async (id: string) => {
  const project = await Project.findById(id)
  if (!project) {
    throw new Error('Project not found')
  }
  const populatedProject = await populateProject(project)

  return populatedProject;
}

export const createProject = async (values: Record<string, any>) => {
  const project = new Project(values)
  if (!project) {
    throw new Error('An error occured while creating new project')
  }
  await project.save();

  const populatedProject = await populateProject(project)
  return populatedProject;
}

export const updateProject = async (id: string, values: Record<string, any>) => {
  const project = await Project.findByIdAndUpdate(id, values, { new: true })
  if (!project) {
    throw new Error('Project could not be updated')
  }

  return await populateProject(project)
}

export const deleteProject = (id: string) => {
  return Project.deleteOne({ _id: id });
}

export const getMembersByRole = async (id: string, role: string) => {
  const project = await getprojectById(id)
  if (!project) {
    throw new Error('Project not found')
  }
  const membersByRole = project.members.filter(member => role === member.role);

  return membersByRole;
}

export const getAllMembers = async (id: string) => {
  const project = await getprojectById(id)
  if (!project) {
    throw new Error('Project not found')
  }

  return project.members;
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

export const sendReminder = async (memberId: string, senderId: string, projectId: string, message: string, res: Response) => {
  const member = await User.findByIdAndUpdate(memberId, 
    { $push: { 
      reminders: {
        project: new mongoose.Types.ObjectId(projectId),
        sender: new mongoose.Types.ObjectId(senderId),
        message
    }}}, { new: true })

  if (!member) {
    return res.status(400).json({ message: "An error occured while sending reminder" })
  }

  return member.save()
}

export const getInviteLink = async (projectId: string) => {
  const project = await getprojectById(projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  const inviteLink = `https://project-manager-q6c3.onrender.com/api/projects/${project.id}/invite/${project.inviteToken}`
  return inviteLink;
}

export const addMember = async (inviteToken: string, req: Request, res: Response) => {
  const project = await Project.findOne({ inviteToken })
  if (project) {
    const userId = req.session.user.id

    // Check if the user is already a member
    const isMember = project.members.some(member => member.user.equals(userId));
    if (!isMember) {
      project.members.push({ user: userId, role: 'member', owner: false });
      await project.save();

      return res.status(200).json({ message: `You have joined "${project.name}" as a member!` }).end()
    } else {
      return res.status(400).send('You are already a member of this project')
    }
  } else {
    return res.status(400).send('Project not found')
  }
}

export const getProgress = async (projectId: string) => {
  const tasks = await getProjectTasks(projectId)
  if (!tasks) {
    throw new Error('An error occured while fetching tasks')
  }

  const completedTasks = tasks.filter(task => task.status === 'Completed')
  const progress = (completedTasks.length / tasks.length) * 100

  return Math.ceil(progress);
}