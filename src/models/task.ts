import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  member: Types.ObjectId
  project: Types.ObjectId
  assignedBy: Types.ObjectId
  deadline: Date
  description: string
  status: string
  urgent: boolean
  comments: Types.ObjectId[]
}

export interface IComment extends Document {
  user: Types.ObjectId
  content: string
  replies: (Types.ObjectId | IComment)[]
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})
export const Comment = mongoose.model<IComment>('Comment', commentSchema);

// Define the valid 'priority' and 'status' values
const STATUS: string[] = ['To-do', 'Completed', 'Awaiting Review']

const taskSchema = new Schema<ITask>({
  member: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  assignedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  deadline: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: STATUS, required: true, default: 'To-do' },
  urgent: { type: Boolean, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

export const Task = mongoose.model<ITask>('Task', taskSchema);