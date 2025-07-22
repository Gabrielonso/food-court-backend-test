import * as jwt from 'jsonwebtoken';
import { Auth } from '../interface/auth.interface';

export const verifyToken = (token: string): Auth => {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('Undefined token secret!');
  }
  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded === 'object' &&
    decoded !== null &&
    'email' in decoded &&
    'role' in decoded &&
    'riderId' in decoded
  ) {
    return decoded as Auth;
  }
  throw new Error('Invalid token payload');
};
