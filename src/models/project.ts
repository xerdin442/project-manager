import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string
  members: { user: Types.ObjectId, role: string }[]
  client: string
  description: string
  deadline: Date
  status: string
  inviteToken: string
}

// Define the valid 'status' values
const STATUS = ['In Progress', 'Completed', 'Archived', 'Cancelled'];

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  members: [{
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    role: { type: String, required: true }
  }],
  client: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: STATUS, required: true, default: 'In Progress' },
  inviteToken: { type: String, required: true, unique: true }
});

export const Project = mongoose.model<IProject>('Project', projectSchema);