import mongoose from "mongoose";
const { Schema } = mongoose

const taskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  project: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
//status: {}
//priority: {}
})

export const Task = mongoose.model('Task', taskSchema);