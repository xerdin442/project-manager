import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  reminders: [{
    project: { type: Schema.Types.ObjectId, required: true },
    sender: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true }
  }],
  role: [{
    project: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true }
  }]
})

export const User = mongoose.model('User', userSchema);