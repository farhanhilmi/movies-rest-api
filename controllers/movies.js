import axios from 'axios';
import fs from 'fs';
import { validationResult } from 'express-validator';

const API_KEY = fs.readFileSync('./.env', 'utf8').split('=')[1];

const ServerError = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
};

export const getMovieUrl = (req, res, next) => {
  if (Object.keys(req.query).length < 1) {
    const error = new Error('Requested resource is forbidden.');
    error.statusCode = 403;
    res.status(403).json({ message: 'Requested resource is forbidden.' });
    throw error;
  }

  const title = req.query.title.split(' ').join('+');

  axios
    .get(`http://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`)
    .then((response) => {
      if (response.data.Response == 'False') {
        const error = new Error('The movie title could not be found.');
        error.statusCode = 404;
        res
          .status(404)
          .json({ message: 'The movie title could not be found.' });
        next(error);
      }

      res.setHeader('Set-Cookie', 'sa=dad');
      res.status(200).json({ posterUrl: response.data.Poster });
    })
    .catch((err) => {
      ServerError(err);
      next(err);
    });
};

export const postFavoriteMovie = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, enter movie title.');
    error.statusCode = 422;
    res.status(422).json({ message: 'Validation failed, enter movie title.' });
    throw error;
  }

  const title = req.body.title;

  req.user
    .createFavorite_movie({ title: title })
    .then(() => {
      res.status(201).json({ message: 'Favorite movie added!' });
    })
    .catch((err) => {
      ServerError(err);
      next(err);
    });
};

export const getFavoriteMovie = (req, res, next) => {
  req.user
    .getFavorite_movies({ where: { userUserId: req.user.user_id } })
    .then(async (movies) => {
      const poster = movies.map((mvs) => {
        return axios
          .get(`http://www.omdbapi.com/?t=${mvs.title}&apikey=${API_KEY}`)
          .then((result) => {
            return result.data.Poster;
          });
      });
      await Promise.all(poster).then((url) => {
        res.status(200).json({
          message: 'Fetched favorite movies success!',
          posterUrl: { url },
        });
      });
    })
    .catch((err) => {
      ServerError(err);
      next(err);
    });
};
