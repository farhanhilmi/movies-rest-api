import jwt from 'jsonwebtoken';
import fs from 'fs';

import User from '../models/user.js';

const privateKey = fs.readFileSync('./private.key', 'utf8');

const notAuthenticatedError = () => {
  const error = new Error('Not authenticated');
  error.statusCode = 401;
  throw error;
};

export default (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    notAuthenticatedError();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, privateKey);
  } catch (err) {
    err.statusCode = 401;
    res.status(401).json({ message: 'Unauthorized!.' });
    throw err;
  }

  if (!decodedToken) {
    notAuthenticatedError();
  }
  // console.log(decodedToken);
  User.findOne({ where: { username: decodedToken.username } })
    .then((user) => {
      // console.log('USER:', user);
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
