import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, required: true },
  password: { type: String, required: true, select: false },
  reminders: [{
    project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true }
  }],
})

export const User = mongoose.model('User', userSchema);