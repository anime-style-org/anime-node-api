import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const web2auth = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (token === '') {
    return res.json({ err: 'Empty token', data: null });
  }

  try {
    verify(token, JWT_SECRET);
  } catch (err) {
    return res.json({ err: 'Invalid token', data: null });
  }

  return next();
};
