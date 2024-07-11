import { User } from '../models/user';

export const getAllUsers = () => {
  return User.find()
}

export const getUserById = (id: string) => {
  return User.findById(id)
}

export const getUserByEmail = (email: string) => {
  return User.findOne({ email: email }).select('+password');
}

export const deleteUserById = (id: string) => {
  return User.deleteOne({ _id: id });
}

export const createUser = async (values: Record<string, any>): Promise<object> => {
  const userDoc = new User(values)

  const user = await userDoc.save();
  return user.toObject();
}