import crypto from 'crypto';

export const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex')

  return token;
}