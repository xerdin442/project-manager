import mongoose from "mongoose";
const { Schema } = mongoose

const projectSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true, minLength: 10, maxLength: 256 },
  deadline: { type: Date, required: true },
  phases: { type: Array<String>, required: true },
//status: {}
})

export const Project = mongoose.model('Project', projectSchema);