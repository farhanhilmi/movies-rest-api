import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

import User from '../models/user.js';

const privateKey = fs.readFileSync('./private.key', 'utf8');

const ERROR = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
};

const customError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        customError("A user with this username can't be found", 401);
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        customError('Wrong password!', 401);
      }

      const token = jwt.sign(
        {
          username: loadedUser.username,
          password: loadedUser.password,
        },
        privateKey,
        { expiresIn: '1h' },
      );

      res.status(200).json({
        message: 'Login Success',
        token: token,
        userId: loadedUser.user_id.toString(),
      });
    })
    .catch((err) => {
      ERROR(err);
      next(err);
    });
};
