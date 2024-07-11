import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import dotenv from 'dotenv';

import routes from '../src/routes/index'
import sessionDts from '../types/session';

const app = express()
dotenv.config();

// Initialize environment variables
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET

// Initialize and configure middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

// Initializing session middlleware
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
})
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 3, secure: false } // Set expiration time of cookie
}))

// Configure routes
app.use(routes)

// Connect to database and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT)
    console.log('Server is running on port 3000')
  })
  .catch(err => console.log(err))