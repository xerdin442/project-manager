import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path'

import initializeRoutes from '../src/routes/index';
import sessionDts from '../types/session';
import { upload } from './config/storage';

const app = express()

dotenv.config(); // Load environment variables

// Initialize and configure middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(__dirname));

// Configure session middlleware
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 3, secure: false } // Set expiration time of cookie
}))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'google.html')); // Adjust the path as needed
});

app.use(upload('images').single('profileImage')) // Initialize multer to handle file uploads
app.use('/api', initializeRoutes()) // Configure routes

// Connect to database and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT)
    console.log('Server is running on port 3000')
  })
  .catch(err => console.log(err))