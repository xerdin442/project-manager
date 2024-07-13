import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';

import routes from '../src/routes/index';
import * as env from '../src/config/secrets'
import sessionDts from '../types/session';

const app = express()

// Initialize and configure middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

// Initializing session middlleware
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: env.MONGO_URI,
  collection: 'sessions'
})
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 3, secure: false } // Set expiration time of cookie
}))

// Configure routes
app.use('/api', routes)

// Connect to database and start the server
mongoose.connect(env.MONGO_URI)
  .then(() => {
    app.listen(env.PORT)
    console.log('Server is running on port 3000')
  })
  .catch(err => console.log(err))