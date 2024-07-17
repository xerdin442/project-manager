import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user';
import { createUser } from '../services/user';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = () => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });

  return authUrl;
};

export const handleGoogleCallback = async (code: string) => {
  const { tokens } = await client.getToken({
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Google ID token verification failed');
  }

  const googleId = payload.sub;
  const username = payload.name;
  const email = payload.email;

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await createUser({
      googleId,
      username,
      email,
    });
  }

  return user;
};
