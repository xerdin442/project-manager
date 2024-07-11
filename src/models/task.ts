import mongoose from "mongoose";
const { Schema } = mongoose

// Define the valid 'priority' and 'status' values
const STATUS: string[] = ['To-do', 'Completed', 'Awaiting Feedback', 'Deferred']
const PRIORITY: string[] = ['Normal', 'High', 'Very Urgent']

const taskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  project: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: STATUS, required: true, default: 'To-do' },
  priority: { type: String, enum: PRIORITY, required: true, default: 'Normal' }
})

export const Task = mongoose.model('Task', taskSchema);