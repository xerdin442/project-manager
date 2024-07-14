import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string
  email: string
  profileImage: string
  password: string
  reminders: { project: Types.ObjectId, sender: Types.ObjectId, message: string }[]
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, required: true, default: '' },
  password: { type: String, required: true, select: false },
  reminders: [{
    project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true }
  }],
})

export const User = mongoose.model<IUser>('User', userSchema);