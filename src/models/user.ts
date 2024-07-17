import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string
  googleId?: string
  email: string
  profileImage: string
  password: string
  reminders: { project: Types.ObjectId, sender: Types.ObjectId, message: string }[],
  resetToken?: string,
  resetTokenExpiration?: Number
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  googleId: { type: String },
  email: { type: String, required: true },
  profileImage: { type: String, required: true },
  password: { type: String, required: true, select: false },
  reminders: [{
    project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true }
  }],
  resetToken: { type: String },
  resetTokenExpiration: { type: Number }
})

export const User = mongoose.model<IUser>('User', userSchema);