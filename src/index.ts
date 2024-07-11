import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import crypto from 'crypto';

import sessionDts from '../types/session';

const app = express()

const MONGO_URI = 'mongodb+srv://mudianthonio27:quadrant27@cluster0.se8ewxi.mongodb.net/project-manager?retryWrites=true&w=majority&appName=Cluster0'
const sessionSecret = crypto.randomBytes(64).toString('hex');

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
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 3, secure: false } // Set expiration time of cookie
}))

// Configure routes


// Connect to database and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(3000)
    console.log('Server is running on port 3000')
  })
  .catch(err => console.log(err))