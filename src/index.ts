import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';

import initializeRoutes from '../src/routes/index';
import { googleAuth } from '../src/config/authentication'
import sessionDts from '../types/session';
import expressUserDts from '../types/express-user'

const app = express()

dotenv.config(); // Load environment variables

// Initialize and configure middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

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

// Initialize passport and authenticate sessions
app.use(passport.initialize())
app.use(passport.session())

googleAuth() // Initialize google authentication strategy

app.use('/api', initializeRoutes()) // Configure routes

// Connect to database and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT)
    console.log('Server is running on port 3000')
  })
  .catch(err => console.log(err))