import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string
export const PORT = (process.env.PORT || 3000) as number
export const SESSION_SECRET = process.env.SESSION_SECRET as string