import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  task: Types.ObjectId
  content: string
  user: Types.ObjectId
  replies: IComment[]
}

const commentSchema = new Schema<IComment>({
  task: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  replies: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }]
})

export const Comment = mongoose.model<IComment>('Comment', commentSchema);