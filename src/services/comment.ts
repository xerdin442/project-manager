import { Comment } from '../models/comment';

export const getAll = () => {
  return Comment.find()
}

export const getCommentById = (id: string) => {
  return Comment.findById(id)
}

export const createComment = async (values: Record<string, any>) => {
  const comment = new Comment(values)
  await comment.save()

  return comment.toObject()
}

export const updateComment = (id: string, values: Record<string, any>) => {
  return Comment.findByIdAndUpdate(id, values, { new: true })
}

export const deleteComment = (id: string) => {
  return Comment.deleteOne({ _id: id });
}