import axios from 'axios';
import fs from 'fs';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import FavoriteMovies from '../models/favorite-movies.js';

const API_KEY = fs.readFileSync('./.env', 'utf8').split('=')[1];

export const getMoviesFromOMDB = (req, res, next) => {
  const title = 'Baby Driver'.split(' ').join('+');
  // console.log(title);
  axios
    .get(`http://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`)
    .then((response) => {
      // console.log({ title: response.data.Title, poster: response.data.Poster });
      res.setHeader('Set-Cookie', 'sa=dad');
      res.status(200).json({ poster: response.data.Poster });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postFavoriteMovie = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, enter movie title.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  // console.log('MOVIES: ', req.user);
  // console.log('MAGIC: ', Object.keys(req.user.__proto__));
  FavoriteMovies.create({ title: title, userUserId: req.user.user_id })
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: 'Favorite movie added!' });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getFavoriteMovie = (req, res, next) => {
  req.user.getFavoriteMoviess((movie) => {
    console.log(movie);
  });
  FavoriteMovies.findAll({ where: { userUserId: req.user.user_id } })
    .then((movies) => {
      // console.log(movies);
      res.status(200).json({
        message: 'Fetched favorite movies success!',
        posterUrl: movies.title,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
