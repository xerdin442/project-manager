import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  task: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  replies: []
})