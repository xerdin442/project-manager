import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the valid 'status' values
const STATUS = ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

const projectSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  phases: { type: [String], required: true },
  status: { type: String, enum: STATUS, required: true, default: 'Not Started' }
});

export const Project = mongoose.model('Project', projectSchema);
