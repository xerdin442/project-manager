import mongoose, { Schema } from "mongoose";

// Define the valid 'status' values
const STATUS = ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

const projectSchema = new Schema({
  name: { type: String, required: true },
  members: [{
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    role: { type: String, required: true }
  }],
  client: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  phases: { type: [String] },
  status: { type: String, enum: STATUS, required: true, default: 'Not Started' },
  inviteToken: { type: String }
});

export const Project = mongoose.model('Project', projectSchema);