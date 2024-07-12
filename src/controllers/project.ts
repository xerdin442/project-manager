import express from 'express';

import * as Project from '../util/project';
import { getUserById } from '../util/user';

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const projects = await Project.getAll()

    return res.status(200).json(projects).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const createProject = async (req: express.Request, res: express.Response) => {
  try {
    const { name, client, description, deadline } = req.body
    const user = await getUserById(req.params.userId)

    const project = Project.createProject({
      name,
      members: [{
        user: user._id,
        role: "admin"
      }],
      client,
      description,
      deadline
    })

    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const updateProject = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params
    const { name, client, description, deadline } = req.body

    const project = await Project.updateProject(projectId, { name, client, description, deadline })

    return res.status(200).json(project).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteProject = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params

    const deletedProject = await Project.deleteProject(projectId)

    return res.status(200).json(deletedProject).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getAllMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params

    const members = await Project.getAllMembers(projectId)

    return res.status(200).json(members).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params
    const { role } = req.query

    if (role !== 'member') {
      return res.sendStatus(403)
    }

    const projectMembers = await Project.getMembersByRole(projectId, role)

    return res.status(200).json(projectMembers).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const getAdmins = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params
    const { role } = req.query

    if (role !== 'admin') {
      return res.sendStatus(403)
    }

    const projectAdmins = await Project.getMembersByRole(projectId, role)

    return res.status(200).json(projectAdmins).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const addAdmin = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, userId } = req.params

    const updatedAdmins = await Project.addAdmin(projectId, userId)

    return res.status(200).json(updatedAdmins).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const deleteMember = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, userId } = req.params

    const updatedMembers = await Project.deleteMember(projectId, userId)

    return res.status(200).json(updatedMembers).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}